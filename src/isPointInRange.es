export default function (x, y, range) {
  const {
    left,
    right,
    top,
    bottom,
  } = range.rect || range.getBoundingClientRect()

  return x > left && x < right && y > top && y < bottom
}
