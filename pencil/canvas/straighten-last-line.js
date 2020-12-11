import common from './common.js'
import connectPointsByPixel from './connect-points-by-pixel.js'

const ACCUMULATED_RANGE = 4
const NEARBY_RANGE = 4
const ACCUMULATED_RATE_LIMIT = .5
const VERTICES_RATE_LIMIT = .3

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
  const direction = (
    rateX === 0 && rateY === 0 ? 1 : (
      Math.abs(rateX) > Math.abs(rateY) ?
      rateX / Math.abs(rateX) :
      rateY / Math.abs(rateY)
    )
  )
  const rate = (rateX ** 2 + rateY ** 2) ** .5 * direction
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
  const pointsAccumulatedRate = []
  pointsRateOfChange.forEach((rate, index) => {
    let accumulatedRate = 0
    if (
      index < ACCUMULATED_RANGE ||
      index >= pointsRateOfChange.length - ACCUMULATED_RANGE
    ) return
    for (
      let i = ACCUMULATED_RANGE * -1;
      i <= ACCUMULATED_RANGE;
      i++
    ) {
      accumulatedRate += pointsRateOfChange[index + i]
    }
    accumulatedRate = Math.abs(accumulatedRate)
    pointsAccumulatedRate.push(accumulatedRate)
  })

  /* Part C */
  const verticesIndex = []
  pointsAccumulatedRate.forEach((accumulatedRate, index) => {
    if (
      Math.abs(accumulatedRate) < ACCUMULATED_RATE_LIMIT
    ) return
    if (verticesIndex.length) {
      const nearbyRates = []
      for (
        let i = index - NEARBY_RANGE;
        i <= index + NEARBY_RANGE;
        i++
      ) {
        if (
          i < 0 ||
          i > pointsAccumulatedRate.length - 1 ||
          i === index
        ) continue
        const nearbyRate = pointsAccumulatedRate[i]
        nearbyRates.push(nearbyRate)
      }
      if (
        nearbyRates.some(nearbyRate => {
          return (
            Math.abs(nearbyRate) >
            Math.abs(accumulatedRate)
          )
        })
      ) return
    }
    const possibleRates = []
    const possibleRatesIndex = []
    for (
      let i = ACCUMULATED_RANGE * -1;
      i <= ACCUMULATED_RANGE;
      i++
    ) {
      const tempIndex = ACCUMULATED_RANGE + index + i
      const rate = pointsRateOfChange[tempIndex]
      possibleRates.push(Math.abs(rate))
      possibleRatesIndex.push(tempIndex)
    }
    const biggestRate = Math.max(...possibleRates)
    const biggestRateTempIndex = possibleRates
      .findIndex(rate => rate === biggestRate)
    const biggestRateIndex = possibleRatesIndex[biggestRateTempIndex]
    const vertexIndex = biggestRateIndex + 1
    if (verticesIndex.includes(vertexIndex)) return
    verticesIndex.push(vertexIndex)
  })
  const vertices = [
    lastSeriesPoints[0],
    ...verticesIndex.map(index => {
      return lastSeriesPoints[index]
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
    if (Math.abs(rate) < VERTICES_RATE_LIMIT) return
    const vertexIndex = index + 1
    obviousVerticesIndex.push(vertexIndex)
  })
  const obviousVertices = [
    lastSeriesPoints[0],
    ...obviousVerticesIndex.map(index => {
      return vertices[index]
    }),
    lastSeriesPoints[lastSeriesPoints.length - 1]
  ]

  /* Finale */
  const imageDataHistory = common.getImageDataHistory()
  const imageData = imageDataHistory[imageDataHistory.length - 2]
  ctx.putImageData(imageData, 0, 0)
  obviousVertices.forEach((point, index) => {
    if (!index) return
    const lastPoint = obviousVertices[index - 1]
    connectPointsByPixel(lastPoint, point)
  })
}
