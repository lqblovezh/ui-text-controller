export default class {
    constructor ({
      _range:range,
      _anchorRangeInfo:anchorRangeInfo,
      _focusRangeInfo:focusRangeInfo,
    }) {
      this.rangeCount = 1
      this.anchorNode = anchorRangeInfo.textNode
      this.anchorOffset = anchorRangeInfo.offset
      this.focusNode = focusRangeInfo.textNode
      this.focusOffset = focusRangeInfo.offset

      this._range = range
    }

    toString () {
      return this._range.toString()
    }

    getRangeAt (index) {
      return index === 0 ? this._range : null
    }
}
