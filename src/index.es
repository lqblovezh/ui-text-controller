import getRangeInfoList from './getRangeInfoList'
import isPointInRange from './isPointInRange'
import findRangeInfo from './findRangeInfo'
import completeRange from './completeRange'
import sort from './sort'
import Controller from './Controller'
import SelectedTextBg from './SelectedTextBg'
import Selection from './Selection'
import RootOffset from './RootOffset'

module.exports = class {
  constructor ({
    div,
    startBtnClassName = null,
    endBtnClassName = null,
    textBgColor = 'rgba(51,143,255,0.5)',
    holdDelay = 800,
    autoInit = true,
    onSelectionChange = () => {},
    onClear = () => {},
    onSelectStart = () => {},
    onSelect = () => {},
    onSelectEnd = () => {},
  }) {
    this.rootEl = typeof div == 'string' ? document.querySelector(div) : div
    this.rootOffset = new RootOffset(this.rootEl)
    this.bgEl = document.createElement('div')
    this.bodyEl = document.createElement('div')
    this.ctrlEl = document.createElement('div')

    moveChildren(this.rootEl, this.bodyEl)

    this.rootEl.appendChild(this.bgEl)
    this.rootEl.appendChild(this.bodyEl)
    this.rootEl.appendChild(this.ctrlEl)

    this.bodyEl.style.position = 'relative'
    this.bgEl.style.position =
    this.ctrlEl.style.position = 'absolute'

    this.bodyEl.style.top =
    this.bgEl.style.top =
    this.ctrlEl.style.top = 0

    this.bgEl.style.zIndex = 1
    this.bodyEl.style.zIndex = 2
    this.ctrlEl.style.zIndex = 3

    this.ctrlEl.style.width =
    this.ctrlEl.style.height = 0

    this.bodyEl.style.overflow = 'hidden'
    this.bodyEl.style.height = 'auto'

    this.controller = new Controller({
      endBtnClassName,
      startBtnClassName,
      ctrlEl: this.ctrlEl,
      offset: {
        top: this.rootOffset.getTop(),
        left: this.rootOffset.getLeft(),
      },
      clickStartBtnHandler: () => {
        this.selecting = true
        if (!this._swapped) {
          this._swap()
          this._swapped = true
        }
      },
      clickEndBtnHandler: () => {
        this.selecting = true
        if (this._swapped) {
          this._swap()
          this._swapped = false
        }
      },
    })
    this.selectedTextBg = new SelectedTextBg({
      textBgColor,
      bgEl: this.bgEl,
      rootEl: this.rootEl,
      offset: {
        top: this.rootOffset.getTop(),
        left: this.rootOffset.getLeft(),
      },
    })

    this.holdDelay = holdDelay
    this.onClear = onClear
    this.onSelectionChange = onSelectionChange
    this.onSelectStart = onSelectStart
    this.onSelect = onSelect
    this.onSelectEnd = onSelectEnd

    if(autoInit) {
      this.init()
    }
  }

  enabled = false

  selecting = false

  _timer = null

  _swapped = false

  _rangeInfoList = null

  _range = null

  _clearable = false

  _reversed = false

  _anchorRangeInfo = null

  _focusRangeInfo = null

  _lastRect = null

  _selectionVisibleWhenInit = false

  init () {
    this.rootEl.style.webkitUserSelect = 'none'
    this.rootEl.addEventListener('selectstart', stopHandler)
    this.bodyEl.addEventListener('touchstart', this._touchStartHander)
    this.rootEl.addEventListener('touchmove', this._touchMoveHandler)
    document.addEventListener('touchend', this._touchEndHandler)
  }

  destroy () {
    if (this.rootEl) {
      this._clearTimeout()
      this.rootEl.removeEventListener('selectstart', stopHandler)
      this.bodyEl.removeEventListener('touchstart', this._touchStartHander)
      this.rootEl.removeEventListener('touchmove', this._touchMoveHandler)
      document.removeEventListener('touchend', this._touchEndHandler)
      moveChildren(this.bodyEl, this.rootEl)
      removeFromParent(this.bgEl)
      removeFromParent(this.bodyEl)
      removeFromParent(this.ctrlEl)
      this.rootEl = null
    }
  }

  update () {
    if (!this.rootEl) {
      return
    }
    this.rootOffset.update()
    this._rangeInfoList = getRangeInfoList({
      scrollTop: this.rootEl.scrollTop + document.body.scrollTop + document.documentElement.scrollTop,
      scrollLeft: this.rootEl.scrollLeft + document.body.scrollLeft + document.documentElement.scrollLeft,
      node: this.bodyEl,
    })
    // const rangeInfo = this._rangeInfoList[0]
    // if (rangeInfo) {
    //
    // }
    this._update()
  }

  clear () {
    if (!this.rootEl) {
      return
    }
    this._range =
    this._lastRect =
    this._focusRangeInfo =
    this._anchorRangeInfo = null
    this._clearable =
    this._swapped =
    this.enabled =
    this.selecting = false
    this.controller.update({
      startRangeInfo: null,
      endRangeInfo: null,
    })
    this.selectedTextBg.update({
      rects: null,
    })
    this.onClear()
  }

  _swap () {
    [this._focusRangeInfo, this._anchorRangeInfo] = [this._anchorRangeInfo, this._focusRangeInfo]
  }

  _clearTimeout () {
    if (this._timer) {
      clearTimeout(this._timer)
      this._timer = null
    }
  }

  _touchStartHander = evt => {
    if (!this._rangeInfoList) {
      return
    }

    this._clearTimeout()
    if (evt.touches.length != 1) {
      return
    }

    this._reversed =
    this._clearable = false
    this._lastRect = null

    const {
      pageX,
      pageY,
    } = evt.touches[0]

    let x = pageX + this.rootEl.scrollLeft
    let y = pageY + this.rootEl.scrollTop

    if (this._range) {
      if (!isPointInRange(x, y, this._range)) {
        this._lastRect = this._range.getBoundingClientRect()
        this._clearable = true
        return
      }
    }
    const rangeInfo = findRangeInfo(x, y, this._rangeInfoList, this._anchorRangeInfo, this._focusRangeInfo)

    if (rangeInfo) {
      this._timer = setTimeout(() => {
        this.enabled = true
        this._anchorRangeInfo = this._focusRangeInfo = rangeInfo
        this._update()
        this.onSelectStart()
      }, this.holdDelay)
    }
  }

  _touchMoveHandler = evt => {
    this._clearTimeout()
    this._clearable = false

    if (!(this.enabled && this.selecting)) {
      return
    }

    stopHandler(evt)

    const {
      pageX,
      pageY,
    } = evt.touches[0]

    let x = pageX + this.rootEl.scrollLeft
    let y = pageY + this.rootEl.scrollTop

    const rangeInfo = findRangeInfo(x, y, this._rangeInfoList, this._anchorRangeInfo, this._focusRangeInfo)
    if (rangeInfo) {

      if (this._swapped) {
        if (this._reversed) {
          if (rangeInfo.order < this._anchorRangeInfo.order) {
            this._anchorRangeInfo = this._rangeInfoList[this._anchorRangeInfo.order - 1] || this._anchorRangeInfo
            this._reversed = false
          }
        } else {
          if (rangeInfo.order > this._anchorRangeInfo.order) {
            this._anchorRangeInfo = this._rangeInfoList[this._anchorRangeInfo.order + 1] || this._anchorRangeInfo
            this._reversed = true
          }
        }
      } else {
        if (this._reversed) {
          if (rangeInfo.order > this._anchorRangeInfo.order) {
            this._anchorRangeInfo = this._rangeInfoList[this._anchorRangeInfo.order + 1] || this._anchorRangeInfo
            this._reversed = false
          }
        } else {
          if (rangeInfo.order < this._anchorRangeInfo.order) {
            this._anchorRangeInfo = this._rangeInfoList[this._anchorRangeInfo.order - 1] || this._anchorRangeInfo
            this._reversed = true
          }
        }
      }

      this._focusRangeInfo = rangeInfo

      this._update()
      this.onSelect()
    }
  }

  _touchEndHandler = evt => {
    this._clearTimeout()

    if (this._clearable) {
      const rect = this._range.getBoundingClientRect()
      if (this._lastRect.top === rect.top && this._lastRect.left === rect.left) {
        stopHandler(evt)
        this.clear()
        this.onSelectEnd()
        return
      }
    }

    this._reversed =
    this.selecting = false

    if (this.enabled && this._range) {
      if (this._focusRangeInfo.order < this._anchorRangeInfo.order) {
          this._swap()
          this._swapped = false
      }
      this.onSelectionChange(new Selection(this))
    }
  }

  _update () {
    if (this.enabled) {
      const anchorRangeInfo = this._rangeInfoList['#'+ this._anchorRangeInfo.id]
      const focusRangeInfo = this._rangeInfoList['#'+ this._focusRangeInfo.id]
      const sortedRangeInfos = sort(anchorRangeInfo, focusRangeInfo)
      this._range = completeRange(...sortedRangeInfos)
      this.controller.update({
        startRangeInfo: sortedRangeInfos[0],
        endRangeInfo: sortedRangeInfos[1],
        offset: {
          top: this.rootOffset.getTop(),
          left: this.rootOffset.getLeft(),
        },
      })
      this.selectedTextBg.update({
        rects: this._range.getClientRects(),
        scrollLeft: this.rootEl.scrollLeft + document.body.scrollLeft + document.documentElement.scrollLeft,
        scrollTop: this.rootEl.scrollTop + document.body.scrollTop + document.documentElement.scrollTop,
        offset: {
          top: this.rootOffset.getTop(),
          left: this.rootOffset.getLeft(),
        },
      })
    } else if (this._selectionVisibleWhenInit && this._rangeInfoList.length > 0) {
      this.selectedTextBg.update({
        rects: completeRange(this._rangeInfoList[0], this._rangeInfoList[this._rangeInfoList.length -1]).getClientRects(),
        scrollLeft: this.rootEl.scrollLeft + document.body.scrollLeft + document.documentElement.scrollLeft,
        scrollTop: this.rootEl.scrollTop + document.body.scrollTop + document.documentElement.scrollTop,
        offset: {
          top: this.rootOffset.getTop(),
          left: this.rootOffset.getLeft(),
        },
      })
    }
  }
}


function stopHandler (evt) {
  evt.preventDefault()
  evt.stopPropagation()
}

function moveChildren (fromEl, toEl) {
  while (fromEl.childNodes.length > 0) {
    toEl.appendChild(fromEl.childNodes[0])
  }
}

function removeFromParent (el) {
  const {parentNode} = el
  if (parentNode) {
    parentNode.removeChild(el)
  }
}
