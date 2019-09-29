import startImage from './image/pos-start.png'
import endImage from './image/pos-end.png'

const BTN_WIDTH = 34;
const BTN_HEIGHT = 92;

export default class {
  constructor ({
    startBtnClassName,
    endBtnClassName,
    ctrlEl,
    clickStartBtnHandler,
    clickEndBtnHandler,
  }) {
    this.ctrlEl = ctrlEl

    this.startEl = document.createElement('div')
    this.endEl = document.createElement('div')

    if (startBtnClassName) {
      this.startEl.className = startBtnClassName
    }
    if (endBtnClassName) {
      this.endEl.className = endBtnClassName
    }
    this.startEl.style.backgroundImage = `url(${startImage})`
    this.endEl.style.backgroundImage = `url(${endImage})`

    this.startEl.style.backgroundRepeat =
    this.endEl.style.backgroundRepeat = 'no-repeat'

    this.startEl.style.transform = 'translate(-50%, -100%)'
    this.endEl.style.transform = 'translate(-50%, 0)'

    this.startEl.style.backgroundPosition = 'center bottom'
    this.endEl.style.backgroundPosition = 'center top'

    this.startEl.style.position =
    this.endEl.style.position = 'absolute'

    this.startEl.ontouchstart = evt => {
      evt.preventDefault()
      evt.stopPropagation()
      clickStartBtnHandler(evt)
    }
    this.endEl.ontouchstart = evt => {
      evt.preventDefault()
      evt.stopPropagation()
      clickEndBtnHandler(evt)
    }

    this.ctrlEl.style.display = 'none'
    this.ctrlEl.appendChild(this.endEl)
    this.ctrlEl.appendChild(this.startEl)
  }

  update ({
    startRangeInfo,
    endRangeInfo,
    offset,
  }) {
    if (startRangeInfo && endRangeInfo) {

      const startRect = startRangeInfo.rect
      const endRect = endRangeInfo.rect

      this.ctrlEl.style.display = 'block'

      const startImgHeight = startRect.height * 2
      const startElHeight = Math.max(startImgHeight, BTN_HEIGHT)
      this.startEl.style.backgroundSize = 'auto '+ startImgHeight +'px'
      this.startEl.style.height = startElHeight +'px'
      this.startEl.style.width = Math.ceil(BTN_WIDTH / BTN_HEIGHT * startElHeight) +'px'
      this.startEl.style.left = startRect.left - offset.left +'px'
      this.startEl.style.top = startRect.top - offset.top + startRect.height +'px'

      const endImgHeight = endRect.height * 2
      const endElHeight = Math.max(endImgHeight, BTN_HEIGHT)
      this.endEl.style.backgroundSize = 'auto '+ endImgHeight +'px'
      this.endEl.style.height = endElHeight +'px'
      this.endEl.style.width = Math.ceil(BTN_WIDTH / BTN_HEIGHT * endElHeight) +'px'
      this.endEl.style.left = endRect.right - offset.left +'px'
      this.endEl.style.top = endRect.top - offset.top +'px'
    } else {
      this.ctrlEl.style.display = 'none'
    }
  }
}
