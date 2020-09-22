/* Constants */
const LINE_WIDTH = 6

/* Temp */
let _lastPoint = []

const CanvasUtils = {
  initCanvas () {
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    canvas.width = window.innerWidth * 2
    canvas.height = window.innerHeight * 2
    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  },

  setLineStyles (options = {}) {
    ctx.lineWidth = options.lineWidth || LINE_WIDTH
    ctx.lineCap = options.lineCap || 'round'
    ctx.lineJoin = options.lineJoin || 'round'
    ctx.strokeStyle = options.strokeStyle || '#333'
  },

  mapCoordinates (point) {
    const ratio = 2
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
    const distanceLimit = distanceRange + 1

    function _getBoundaries (...coordinates) {
      const boundaries = Array(...coordinates)
        .sort((a, b) => a - b)
        .map((x, index) => {
          const boundary = (
            x + LINE_WIDTH / 2 * (index ? 1 : -1)
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
      const grayValue = Number.parseInt(
        (1 - grayScale) * 255
      )
      return grayValue
    }

    const xBoundaries = _getBoundaries(
      pointA[0], pointB[0]
    )
    const yBoundaries = _getBoundaries(
      pointA[1], pointB[1]
    )
    const imageData = ctx.getImageData(
      0, 0, canvas.width, canvas.height
    )
    for (
      let i = xBoundaries[0];
      i <= xBoundaries[1];
      i++
    ) {
      for (
        let j = yBoundaries[0];
        j <= yBoundaries[1];
        j++
      ) {
        const point = [i, j]
        const dataIndex = (j * imageData.width + i) * 4
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
    ctx.putImageData(imageData, 0, 0)
  }
}
