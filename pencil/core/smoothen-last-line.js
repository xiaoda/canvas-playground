import common from './common.js'
import connectPointsByPixel from './connect-points-by-pixel.js'

function processSeriesPoints (points) {
  const ratio = [.3, .4, .3]
  let newPoints = []
  points.forEach((point, index) => {
    let newPoint
    if (
      index < 1 ||
      index >= points.length - 1
    ) {
      newPoint = point
    } else {
      const lastPoint = points[index - 1]
      const nextPoint = points[index + 1]
      newPoint = [(
        lastPoint[0] * ratio[0] +
        point[0] * ratio[1] +
        nextPoint[0] * ratio[2]
      ), (
        lastPoint[1] * ratio[0] +
        point[1] * ratio[1] +
        nextPoint[1] * ratio[2]
      )]
    }
    newPoints.push(newPoint)
  })
  return newPoints
}

export default function smoothenLastLine () {
  let processingSeriesPoints = common.getLastSeriesPoints()
  processingSeriesPoints = GeometryUtils.repeatedlyCall(
    processSeriesPoints, 10, processingSeriesPoints
  )
  const imageDataHistory = common.getImageDataHistory()
  const imageData = imageDataHistory[imageDataHistory.length - 2]
  ctx.putImageData(imageData, 0, 0)
  processingSeriesPoints.forEach((point, index) => {
    if (index < 1) return
    const lastPoint = processingSeriesPoints[index - 1]
    connectPointsByPixel(lastPoint, point)
  })
}
