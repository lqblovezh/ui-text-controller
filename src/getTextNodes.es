const filter = new RegExp(`^(${[
  'audio',
  'video',
  'object',
  'embed',
  'iframe',
  'script',
  'noscript',
  'template',
  'textarea',
  'button',
  'optgroup',
  'option',
  'progress',
  'datalist',
  'command',
  'applet',
  'canvas',
  'svg',
  'caption',
  'table',
].join('|')})$`, 'i')

export default function getTextNodes(node, textNodes = []) {
  for (let i = 0, {length} = node.childNodes; i < length; i++) {
    let child = node.childNodes[i];
    if (filter.test(child.nodeName)) {
      continue
    } else if (child.nodeType === 3 && child.nodeValue && child.nodeValue.trim()) {
      textNodes.push(child);
    } else if (child.nodeType === 1) {
      getTextNodes(child, textNodes);
    }
  }
  return textNodes;
}
