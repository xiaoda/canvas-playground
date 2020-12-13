import common from '../canvas/common.js'

export default function inspectLastSeriesPoints () {
  const lastSeriesPoints = common.getLastSeriesPoints()
  const pointsDistance = []
  lastSeriesPoints.forEach((point, index) => {
    if (!index) return
    const lastPoint = lastSeriesPoints[index - 1]
    const distance = GeometryUtils
      .getDistanceBetweenPoints(lastPoint, point)
    pointsDistance.push(distance)
  })
  const pointsTotalDistance = pointsDistance
    .reduce((total, current) => total + current)
  const averagePointsDistance = (
    pointsTotalDistance /
    (pointsDistance.length - 1)
  )
  console.warn(
    'Average Points Distance',
    averagePointsDistance
  )
}
