export default function connectPoints (
  pointA, pointB
) {
  if (!pointA) return
  else if (!pointB) pointB = pointA
  window.ctx.beginPath()
  window.ctx.moveTo(...pointA)
  window.ctx.lineTo(...pointB)
  window.ctx.stroke()
}
