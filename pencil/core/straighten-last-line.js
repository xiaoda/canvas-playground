import common from './common.js'
import connectPointsByPixel from './connect-points-by-pixel.js'

export default _ => {
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
    pointsRateOfChange.push(rate)
  })

  /* Part B */
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

  /* Part C */
  const sortedPointsAccumulatedRate = GeometryUtils
    .clone(pointsAccumulatedRate)
    .sort((a, b) => b - a)
  const verticesIndex = []
  for (
    let i = 0;
    i < sortedPointsAccumulatedRate.length - 1;
    i++
  ) {
    const rate = sortedPointsAccumulatedRate[i]
    const index = pointsAccumulatedRate
      .findIndex(r => r === rate)
    // if (rate < 1) break
    if (verticesIndex.length) {
      const nearbyRates = []
      for (
        let j = index - accumlatedRange;
        j <= index + accumlatedRange;
        j++
      ) {
        if (
          j < 0 ||
          j > pointsAccumulatedRate.length - 1 ||
          j === index
        ) continue
        const nearbyRate = pointsAccumulatedRate[j]
        nearbyRates.push(nearbyRate)
      }
      if (
        nearbyRates.some(nearbyRate => nearbyRate > rate)
      ) continue
    }
    verticesIndex.push(index)
  }
  const vertices = [
    lastSeriesPoints[0],
    ...verticesIndex
      .sort((a, b) => a - b)
      .map(index => {
        const tempIndex = index + accumlatedRange + 1
        return lastSeriesPoints[tempIndex]
      }),
    lastSeriesPoints[lastSeriesPoints.length - 1]
  ]

  /* Finale */
  const imageDataHistory = common.getImageDataHistory()
  const imageData = imageDataHistory[imageDataHistory.length - 2]
  ctx.putImageData(imageData, 0, 0)
  vertices.forEach((point, index) => {
    if (index < 1) return
    const lastPoint = vertices[index - 1]
    connectPointsByPixel(lastPoint, point)
  })
}
