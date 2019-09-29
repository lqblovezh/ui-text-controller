export default function (startRangeInfo, endRangeInfo) {
  const range = new Range()
  range.setStart(startRangeInfo.textNode, startRangeInfo.offset)
  range.setEnd(endRangeInfo.textNode, endRangeInfo.offset + 1)
  return range
}
