import getTextNodes from './getTextNodes'

const maxWidth = screen.width / 2

export default function ({
  node,
  scrollTop,
  scrollLeft,
}) {
  const textNodes = getTextNodes(node)

  const ranges = []
  let index = -1
  for (let textNode of textNodes) {
    for (let i = 0, {length}=textNode.nodeValue; i < length; i++) {
      index++
      const range = new Range()
      range.setStart(textNode, i)
      range.setEnd(textNode, i + 1)
      const {
        width,
        height,
        top,
        bottom,
        left,
        right,
      } = range.getBoundingClientRect()
      if (width > maxWidth || width === 0 || height === 0) {
        continue
      }
      ranges.push(ranges['#'+index] = {
        id: index,
        order: ranges.length,
        textNode,
        _text: range.toString(),
        offset: i,
        rect: {
          width,
          height,
          top: top + scrollTop,
          bottom: bottom + scrollTop,
          left: left + scrollLeft,
          right: right + scrollLeft,
        },
      })
    }
  }
  return ranges
}
