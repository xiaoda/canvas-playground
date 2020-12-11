import common from '../canvas/common.js'

export default function updateLastSeriesPoints () {
  const lastSeriesPoints = common.getLastSeriesPoints()
  const pointsDistance = []
  lastSeriesPoints.forEach((point, index) => {
    if (!index) return
    const lastPoint = lastSeriesPoints[index - 1]
    const distance = GeometryUtils
      .getDistanceBetweenPoints(lastPoint, point)
    pointsDistance.push(distance)
  })
  const pointsDistanceSum = pointsDistance
    .reduce((sum, current) => sum + current)
  const averagePointsDistance = (
    pointsDistanceSum /
    (pointsDistance.length - 1)
  )
  console.warn(
    'Last Series Points Count',
    lastSeriesPoints.length
  )
  console.warn(
    'Average Points Distance',
    averagePointsDistance
  )
}
