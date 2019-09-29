import isPointInRange from './isPointInRange'

export default function (x, y, rangeInfoList, anchorRangeInfo, focusRangeInfo) {
  let firstRangeInfo = null
  for (let rangeInfo of rangeInfoList) {
    if (isPointInRange(x, y, rangeInfo)) {
      firstRangeInfo = rangeInfo
      break
    }
  }

  if (!firstRangeInfo && anchorRangeInfo) {
    const anchorRect = anchorRangeInfo.rect
    const focusRect = focusRangeInfo.rect

    if (y <= focusRect.top && y >= focusRect.bottom) {
      if (x < focusRect.left) {
        return findStartRangeInfo (x, y, rangeInfoList, true)
      } else if (x > focusRect.right) {
        return findEndRangeInfo (x, y, rangeInfoList, true)
      }
    } else if (y < anchorRect.top) {
      return findStartRangeInfo (x, y, rangeInfoList)
    } else if (y > anchorRect.bottom) {
      return findEndRangeInfo (x, y, rangeInfoList)
    }
  }
  return firstRangeInfo
}

function findStartRangeInfo (x, y, rangeInfoList, inLine) {
  for (let i=0, {length}=rangeInfoList; i<length; i++) {
    const rangeInfo = rangeInfoList[i]
    if (y < rangeInfo.rect.bottom) {
      if (inLine) {
        if (x < rangeInfo.rect.left) {
          return rangeInfo
        }
      } else {
        return rangeInfo
      }
    }
  }
}

function findEndRangeInfo (x, y, rangeInfoList, inLine) {
  const {length} = rangeInfoList
  for (let i=length; i>0; i--) {
    const rangeInfo = rangeInfoList[i-1]
    if (y > rangeInfo.rect.top) {
      if (inLine) {
        if (x > rangeInfo.rect.right) {
          return rangeInfo
        }
       } else {
        return rangeInfo
      }
    }
  }
}
