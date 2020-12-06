/* Constants */
const CANVAS_RATIO = 2
const LINE_WIDTH = 2
const SHADOW_RANGE = 3

/* Temp */
let _imageDataHistory
let _currentHistoryIndex
let _lastPoint
let _lastSeriesPoints

const CanvasUtils = {
  init () {
    _imageDataHistory = []
    _currentHistoryIndex = 0
    _lastPoint = []
    _lastSeriesPoints = []

    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    canvas.width = window.innerWidth * CANVAS_RATIO
    canvas.height = window.innerHeight * CANVAS_RATIO
    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    this.saveImageDataHistory()
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

  saveImageDataHistory (imageData) {
    imageData = imageData ? imageData : (
      ctx.getImageData(0, 0, canvas.width, canvas.height)
    )
    let currentHistoryIndex = this.getCurrentHistoryIndex()
    _imageDataHistory.splice(
      currentHistoryIndex + 1,
      _imageDataHistory.length
    )
    currentHistoryIndex = (
      _imageDataHistory.push(imageData) - 1
    )
    this.setCurrentHistoryIndex(currentHistoryIndex)
  },

  getImageDataHistory () {
    return _imageDataHistory
  },

  setCurrentHistoryIndex (index) {
    _currentHistoryIndex = index
    const imageDataHistory = this.getImageDataHistory()
    const imageData = imageDataHistory[index]
    ctx.putImageData(imageData, 0, 0)
  },

  getCurrentHistoryIndex () {
    return _currentHistoryIndex
  },

  saveLastPoint (point) {
    _lastPoint = point
  },

  getLastPoint () {
    return _lastPoint
  },

  clearLastSeriesPoints () {
    _lastSeriesPoints = []
  },

  saveLastSeriesPoints (point) {
    _lastSeriesPoints.push(point)
  },

  getLastSeriesPoints () {
    return _lastSeriesPoints
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
      grayScale *= .9
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
  },

  smoothenLastLine () {
    let processingSeriesPoints = this.getLastSeriesPoints()

    function _processSeriesPoints (points) {
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

    processingSeriesPoints = GeometryUtils.repeatedlyCall(
      _processSeriesPoints, 10, processingSeriesPoints
    )
    const imageDataHistory = this.getImageDataHistory()
    const imageData = imageDataHistory[imageDataHistory.length - 2]
    ctx.putImageData(imageData, 0, 0)
    processingSeriesPoints.forEach((point, index) => {
      if (index < 1) return
      const lastPoint = processingSeriesPoints[index - 1]
      this.connectPointsByPixel(lastPoint, point)
    })
  },

  straightenLastLine () {
    /* Part A */
    const lastSeriesPoints = this.getLastSeriesPoints()
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
    const imageDataHistory = this.getImageDataHistory()
    const imageData = imageDataHistory[imageDataHistory.length - 2]
    ctx.putImageData(imageData, 0, 0)
    vertices.forEach((point, index) => {
      if (index < 1) return
      const lastPoint = vertices[index - 1]
      this.connectPointsByPixel(lastPoint, point)
    })
  }
}
