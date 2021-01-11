import common from './common.js'
import connectPointsByPixel from './connect-points-by-pixel.js'

export default function makeLastLinePolygon () {
  const lastSeriesPoints = common.getLastSeriesPoints()

  /* Part A */
  const lineSegments = []
  let crossPoint
  let startPointIndex
  let endPointIndex
  for (
    let index = 0;
    index < lastSeriesPoints.length;
    index++
  ) {
    if (!index) continue
    else if (index >= lastSeriesPoints.length - 1) break
    const point = lastSeriesPoints[index]
    const lastPoint = lastSeriesPoints[index - 1]
    const nextPoint = lastSeriesPoints[index + 1]
    const lineSegment = [lastPoint, point]
    const nextLineSegment = [point, nextPoint]
    if (lineSegments.length) {
      for (let i = 0; i < lineSegments.length; i++) {
        const tempLineSegment = lineSegments[i]
        const tempCrossPoint = GeometryUtils
          .getCrossPointBetweenLineSegments(
            tempLineSegment, nextLineSegment
          )
        if (tempCrossPoint) {
          crossPoint = tempCrossPoint
          startPointIndex = i + 1
          endPointIndex = index
          break
        }
      }
      if (crossPoint) {
        break
      }
    }
    lineSegments.push(lineSegment)
  }
  console.log('crossPoint', crossPoint)
  console.log('startPointIndex', startPointIndex)
  console.log('endPointIndex', endPointIndex)

  /* Part B */
  if (crossPoint) {

  } else {}
}
