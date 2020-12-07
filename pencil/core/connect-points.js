export default (pointA, pointB) => {
  if (!pointA) return
  else if (!pointB) pointB = pointA
  ctx.beginPath()
  ctx.moveTo(...pointA)
  ctx.lineTo(...pointB)
  ctx.stroke()
}
