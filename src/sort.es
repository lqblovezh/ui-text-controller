export default function (anchorRangeInfo, focusRangeInfo) {
  if (focusRangeInfo.order > anchorRangeInfo.order) {
    return [anchorRangeInfo, focusRangeInfo]
  } else {
    return [focusRangeInfo, anchorRangeInfo]
  }
}
