import common from './common.js'
import connectPointsByPixel from './connect-points-by-pixel.js'

function getRateOfChange (
  lastPoint, point, nextPoint
) {
  const lastPointDistance =
    GeometryUtils.getDistanceBetweenPoints(
      point, lastPoint
    )
  const nextPointDistance =
    GeometryUtils.getDistanceBetweenPoints(
      point, nextPoint
    )
  const rateX = (
    (nextPoint[0] - point[0]) / nextPointDistance -
    (point[0] - lastPoint[0]) / lastPointDistance
  )
  const rateY = (
    (nextPoint[1] - point[1]) / nextPointDistance -
    (point[1] - lastPoint[1]) / lastPointDistance
  )
  /*
  const direction = (
    rateX === 0 && rateY === 0 ? 1 : (
      Math.abs(rateX) > Math.abs(rateY) ?
      rateX / Math.abs(rateX) :
      rateY / Math.abs(rateY)
    )
  )
  */
  const rate = (rateX ** 2 + rateY ** 2) ** .5
  return rate
}

export default function straightenLastLine () {
  /* Part A */
  const lastSeriesPoints = common.getLastSeriesPoints()
  const pointsRateOfChange = []
  lastSeriesPoints.forEach((point, index) => {
    if (
      index < 1 ||
      index >= lastSeriesPoints.length - 1
    ) return
    const lastPoint = lastSeriesPoints[index - 1]
    const nextPoint = lastSeriesPoints[index + 1]
    const rate = getRateOfChange(
      lastPoint, point, nextPoint
    )
    pointsRateOfChange.push(rate)
  })

  /* Part B */
  /*
  const pointsAccumulatedRate = []
  const accumlatedRange = 3
  pointsRateOfChange.forEach((rate, index) => {
    let accumulatedRate = 0
    if (
      index < accumlatedRange ||
      index >= pointsRateOfChange.length - accumlatedRange
    ) return
    for (
      let i = accumlatedRange * -1;
      i <= accumlatedRange;
      i++
    ) {
      accumulatedRate += pointsRateOfChange[index + i]
    }
    accumulatedRate = Math.abs(accumulatedRate)
    pointsAccumulatedRate.push(accumulatedRate)
  })
  */

  /* Part C */
  /*
  const sortedPointsRateOfChange = GeometryUtils
    .clone(pointsRateOfChange)
    .sort((a, b) => b - a)
  */
  const verticesIndex = []
  const nearbyRange = 2
  pointsRateOfChange.forEach((rate, index) => {
    if (verticesIndex.length) {
      const nearbyRates = []
      for (
        let j = index - nearbyRange;
        j <= index + nearbyRange;
        j++
      ) {
        if (
          j < 0 ||
          j > pointsRateOfChange.length - 1 ||
          j === index
        ) continue
        const nearbyRate = pointsRateOfChange[j]
        nearbyRates.push(nearbyRate)
      }
      if (
        nearbyRates.some(nearbyRate => nearbyRate >= rate)
      ) return
    }
    verticesIndex.push(index)
  })
  const vertices = [
    lastSeriesPoints[0],
    ...verticesIndex.map(index => {
      const tempIndex = index + 1
      return lastSeriesPoints[tempIndex]
    }),
    lastSeriesPoints[lastSeriesPoints.length - 1]
  ]

  /* Part D */
  const verticesRateOfChange = []
  const obviousVerticesIndex = []
  vertices.forEach((vertex, index) => {
    if (
      index < 1 ||
      index >= vertices.length - 1
    ) return
    const lastVertex = vertices[index - 1]
    const nextVertex = vertices[index + 1]
    const rate = getRateOfChange(
      lastVertex, vertex, nextVertex
    )
    verticesRateOfChange.push(rate)
  })
  verticesRateOfChange.forEach((rate, index) => {
    if (rate < .8) return
    obviousVerticesIndex.push(index)
  })
  const obviousVertices = [
    lastSeriesPoints[0],
    ...obviousVerticesIndex.map(index => {
      const tempIndex = index + 1
      return vertices[tempIndex]
    }),
    lastSeriesPoints[lastSeriesPoints.length - 1]
  ]

  /* Finale */
  const imageDataHistory = common.getImageDataHistory()
  const imageData = imageDataHistory[imageDataHistory.length - 2]
  ctx.putImageData(imageData, 0, 0)
  obviousVertices.forEach((point, index) => {
    if (index < 1) return
    const lastPoint = obviousVertices[index - 1]
    connectPointsByPixel(lastPoint, point)
  })
}
