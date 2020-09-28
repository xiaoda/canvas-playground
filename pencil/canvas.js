/* Constants */
const CANVAS_RATIO = 2
const LINE_WIDTH = 3
const SHADOW_RANGE = 3

/* Temp */
let _lastPoint = []

const CanvasUtils = {
  initCanvas () {
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    canvas.width = window.innerWidth * CANVAS_RATIO
    canvas.height = window.innerHeight * CANVAS_RATIO
    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  },

  setLineStyles (options = {}) {
    ctx.lineWidth = options.lineWidth || (LINE_WIDTH + SHADOW_RANGE)
    ctx.lineCap = options.lineCap || 'round'
    ctx.lineJoin = options.lineJoin || 'round'
    ctx.strokeStyle = options.strokeStyle || '#222'
  },

  mapCoordinates (point) {
    const ratio = CANVAS_RATIO
    point = point.map(coordinate => coordinate * ratio)
    return point
  },

  saveLastPoint (point) {
    _lastPoint = point
  },

  getLastPoint () {
    return _lastPoint
  },

  connectPoints (pointA, pointB) {
    if (!pointA) return
    else if (!pointB) pointB = pointA
    ctx.beginPath()
    ctx.moveTo(...pointA)
    ctx.lineTo(...pointB)
    ctx.stroke()
  },

  connectPointsByPixel (pointA, pointB) {
    if (!pointA) return
    else if (!pointB) pointB = pointA
    const distanceRange = LINE_WIDTH / 2
    const distanceLimit = distanceRange + SHADOW_RANGE

    function _getBoundaries (...coordinates) {
      const boundaries = Array(...coordinates)
        .sort((a, b) => a - b)
        .map((x, index) => {
          const boundary = (
            x + (LINE_WIDTH / 2 + SHADOW_RANGE) * (index ? 1 : -1)
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
    function _getGrayValueByDistance (distance) {
      let grayScale
      if (distance > distanceLimit) {
        grayScale = 0
      } else if (distance < distanceRange) {
        grayScale = 1
      } else {
        grayScale = (
          (distanceLimit - distance) /
          (distanceLimit - distanceRange)
        )
      }
      grayScale *= 0.9
      const grayValue = Number.parseInt(
        (1 - grayScale) * 255
      )
      return grayValue
    }

    const xBoundaries = _getBoundaries(pointA[0], pointB[0])
    const yBoundaries = _getBoundaries(pointA[1], pointB[1])
    const xBoundariesLength = xBoundaries[1] - xBoundaries[0]
    const yBoundariesLength = yBoundaries[1] - yBoundaries[0]
    const imageData = ctx.getImageData(
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
        const grayValue = _getGrayValueByDistance(distance)
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
    ctx.putImageData(
      imageData, xBoundaries[0], yBoundaries[0]
    )
  }
}
