import common from './common.js'
import connectPointsByPixel from './connect-points-by-pixel.js'

const PROCESS_RATIO = [.3, .4, .3]
const REPEATEDLY_PROCESS_TIMES = 5

function processSeriesPoints (points) {
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
        lastPoint[0] * PROCESS_RATIO[0] +
        point[0] * PROCESS_RATIO[1] +
        nextPoint[0] * PROCESS_RATIO[2]
      ), (
        lastPoint[1] * PROCESS_RATIO[0] +
        point[1] * PROCESS_RATIO[1] +
        nextPoint[1] * PROCESS_RATIO[2]
      )]
    }
    newPoints.push(newPoint)
  })
  return newPoints
}

export default function smoothenLastLine () {
  let processingSeriesPoints = common.getLastSeriesPoints()
  processingSeriesPoints = GeometryUtils.repeatedlyCall(
    processSeriesPoints,
    REPEATEDLY_PROCESS_TIMES,
    processingSeriesPoints
  )
  const imageDataHistory = common.getImageDataHistory()
  const imageData = imageDataHistory[imageDataHistory.length - 2]
  ctx.putImageData(imageData, 0, 0)
  processingSeriesPoints.forEach((point, index) => {
    if (!index) return
    const lastPoint = processingSeriesPoints[index - 1]
    connectPointsByPixel(lastPoint, point)
  })
}
