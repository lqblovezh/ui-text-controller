import offset from 'global-offset'
import computedStyle from 'computed-style'

export default class {
  constructor(rootEl){
    this.rootEl = rootEl
  }

  paddingTop = 0;
  paddingLeft = 0;
  offsetTop = 0;
  offsetLeft = 0;

  getTop () {
    return this.paddingTop + this.offsetTop
  }

  getLeft () {
    return this.paddingLeft + this.offsetLeft
  }

  update () {
    const {
      top,
      left,
    } = offset(this.rootEl)
    this.offsetTop = top
    this.offsetLeft = left
    this.paddingTop = parseInt(computedStyle(this.rootEl, 'paddingTop'))
    this.paddingLeft = parseInt(computedStyle(this.rootEl, 'paddingLeft'))
  }
}
