import config from './config.js'

const DISTANCE_RANGE = config.LINE_WIDTH / 2
const DISTANCE_LIMIT = DISTANCE_RANGE + config.SHADOW_RANGE

function getBoundaries (...coordinates) {
  const boundaries = Array(...coordinates)
    .sort((a, b) => a - b)
    .map((x, index) => {
      const boundary = (
        x + (config.LINE_WIDTH / 2 + config.SHADOW_RANGE) * (index ? 1 : -1)
      )
      const intBoundary = (
        index ?
        Math.ceil(boundary) :
        Math.floor(boundary)
      )
      return intBoundary
    })
  return boundaries
}

function getGrayValueByDistance (distance) {
  let grayScale
  if (distance > DISTANCE_LIMIT) {
    grayScale = 0
  } else if (distance < DISTANCE_RANGE) {
    grayScale = 1
  } else {
    grayScale = (
      (DISTANCE_LIMIT - distance) /
      (DISTANCE_LIMIT - DISTANCE_RANGE)
    )
  }
  grayScale *= .9
  const grayValue = Number.parseInt(
    (1 - grayScale) * 255
  )
  return grayValue
}

export default function connectPointsByPixel (
  pointA, pointB
) {
  if (!pointA) return
  else if (!pointB) pointB = pointA

  const xBoundaries = getBoundaries(pointA[0], pointB[0])
  const yBoundaries = getBoundaries(pointA[1], pointB[1])
  const xBoundariesLength = xBoundaries[1] - xBoundaries[0]
  const yBoundariesLength = yBoundaries[1] - yBoundaries[0]
  const imageData = window.ctx.getImageData(
    xBoundaries[0], yBoundaries[0],
    xBoundariesLength, yBoundariesLength
  )
  for (let i = 0; i < xBoundariesLength; i++) {
    for (let j = 0; j < yBoundariesLength; j++) {
      const point = [
        xBoundaries[0] + i,
        yBoundaries[0] + j
      ]
      const dataIndex = (j * xBoundariesLength + i) * 4
      const distance = GeometryUtils.getDistanceFromPointToLineSegment(
        pointA, pointB, point
      )
      const grayValue = getGrayValueByDistance(distance)
      for (
        let index = dataIndex;
        index < dataIndex + 3;
        index++
      ) {
        const currentValue = imageData.data[index]
        if (grayValue < currentValue) {
          imageData.data[index] = grayValue
        }
      }
    }
  }
  window.ctx.putImageData(
    imageData, xBoundaries[0], yBoundaries[0]
  )
}
