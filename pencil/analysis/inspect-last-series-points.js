import common from '../canvas/common.js'

const UPDATE_ORIGINAL_POINTS = true
const TARGET_CLOSEST_POINTS_DISTANCE = 16
const SIDE_POINTS_WEIGHT = .05

function getAveragePointsDistance (points) {
  const pointsDistance = []
  let averagePointsDistance
  points.forEach((point, index) => {
    if (!index) return
    const lastPoint = points[index - 1]
    const distance = GeometryUtils
      .getDistanceBetweenPoints(lastPoint, point)
    pointsDistance.push(distance)
  })
  if (pointsDistance.length) {
    const pointsDistanceSum = pointsDistance
      .reduce((sum, current) => sum + current)
    averagePointsDistance = (
      pointsDistanceSum /
      (pointsDistance.length - 1)
    )
  } else {
    averagePointsDistance = 0
  }
  return averagePointsDistance
}

function inspectClosestPoints (
  secondlastPoint, lastPoint, point, nextPoint
) {
  const distance = GeometryUtils
    .getDistanceBetweenPoints(lastPoint, point)
  const resultPoints = []
  if (distance > TARGET_CLOSEST_POINTS_DISTANCE) {
    const midPoint = GeometryUtils
      .getMidPointBetweenPoints(lastPoint, point)
    const direction = GeometryUtils
      .getDirection(lastPoint, point)
    const verticalDirection = GeometryUtils
      .getVerticalDirection(direction)
    const virtualPoint = GeometryUtils
      .getPointByPointDirectionDistance(midPoint, verticalDirection, 1)

    function calculateOffset (vertexA, vertexB, point) {
      const tempDistance = GeometryUtils
        .getDistanceBetweenPoints(point, vertexB)
      const offset = GeometryUtils
        .getDistanceFromPointToLine(vertexA, vertexB, point)
        * distance / tempDistance
      const crossPoint = GeometryUtils
        .getVerticalCrossPointFromPointToLine(midPoint, virtualPoint, point)
      const tempDirection = GeometryUtils
        .getDirection(midPoint, crossPoint)
      const isSameDirection = GeometryUtils
        .isSameDirection(tempDirection, verticalDirection)
      const signedOffset = offset * (isSameDirection ? -1 : 1)
      return signedOffset
    }
    let totalOffset = 0
    if (secondlastPoint) {
      totalOffset += calculateOffset(
        point, lastPoint, secondlastPoint
      )
    }
    if (nextPoint) {
      totalOffset += calculateOffset(
        lastPoint, point, nextPoint
      )
    }
    totalOffset *= SIDE_POINTS_WEIGHT
    const generatedPoint = GeometryUtils
      .getPointByPointDirectionDistance(
        midPoint, verticalDirection, totalOffset
      )
    resultPoints.push(
      ...inspectClosestPoints(
        secondlastPoint, lastPoint, generatedPoint, point
      ),
      generatedPoint,
      ...inspectClosestPoints(
        lastPoint, generatedPoint, point, nextPoint
      )
    )
  }
  return resultPoints
}

export default function inspectLastSeriesPoints () {
  const lastSeriesPoints = common.getLastSeriesPoints()
  const averagePointsDistance = getAveragePointsDistance(
    lastSeriesPoints
  )
  console.warn(
    'Average Points Distance',
    averagePointsDistance
  )
  if (UPDATE_ORIGINAL_POINTS) {
    const newSeriesPoints = []
    lastSeriesPoints.forEach((point, index) => {
      if (index) {
        const closestPoints = []
        for (let i = -2; i < 2; i++) {
          const tempIndex = index + i
          const tempPoint = (
            tempIndex >= 0 &&
            tempIndex < lastSeriesPoints.length
          ) ? lastSeriesPoints[tempIndex] : null
          closestPoints.push(tempPoint)
        }
        const additionalPoints = inspectClosestPoints(
          ...closestPoints
        )
        if (additionalPoints.length) {
          newSeriesPoints.push(...additionalPoints)
        }
      }
      newSeriesPoints.push(point)
    })
    const newAveragePointsDistance = getAveragePointsDistance(
      newSeriesPoints
    )
    common.updateLastSeriesPoints(newSeriesPoints)
    console.warn(
      'New Average Points Distance',
      newAveragePointsDistance
    )
  }
}
