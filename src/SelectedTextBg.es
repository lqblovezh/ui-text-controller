import vdom from 'virtual-dom'
import main from 'main-loop'

const h = vdom.h

export default class {
  constructor (opts) {
    const {
      bgEl,
    } = opts

    this.loop = main([], this.render(opts), vdom)
    bgEl.appendChild(this.loop.target)
  }

  render = opts => ({
    rects,
    offset,
    scrollTop,
    scrollLeft,
  }) => {
    const children = []
    const attrs = {}
    const lines = {}
    if (rects && rects.length) {
      let lastRect = null
      for (let i=rects.length; i>0; i--) {
        let rect = rects[i-1]
        const {
          left,
          right,
          top,
          width,
          height,
          bottom,
        } = rect
        if (width === 0
          || height === 0
          || lastRect !== null
          && left <= lastRect.left
          && right >= lastRect.right
          && top <= lastRect.top
          && bottom >= lastRect.bottom
        ) {
          continue
        }
        let _rect = lines[top]
        if (_rect) {
          if (left >= _rect.left
            && right <= _rect.right
            && bottom <= _rect.bottom
          ) {
            continue
          }
        }
        lastRect = rect
        lines[top] = rect
        children.push(h('div', {
          style: {
            position: 'absolute',
            left: (left - offset.left + scrollLeft) +'px',
            top: (top - offset.top + scrollTop) +'px',
            width: width +'px',
            height: height +'px',
            backgroundColor: opts.textBgColor || 'rgba(51,143,255,0.5)',
          },
        }))
      }
    } else {
      attrs.hidden = true
    }
    return h('div', attrs, children)
  }

  update (data) {
    this.loop.update(data)
  }
}
