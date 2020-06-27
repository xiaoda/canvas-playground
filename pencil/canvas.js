let _lastPoint = []

const CanvasUtils = {
  initCanvas () {
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    canvas.width = window.innerWidth * 2
    canvas.height = window.innerHeight * 2
  },

  setLineStyles (options = {}) {
    ctx.lineWidth = options.lineWidth || 6
    ctx.strokeStyle = options.strokeStyle || '#333'
    ctx.lineCap = options.lineCap || 'round'
    ctx.lineJoin = options.lineJoin || 'round'
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
    if (!pointB) pointB = pointA
    ctx.beginPath()
    ctx.moveTo(...pointA)
    ctx.lineTo(...pointB)
    ctx.stroke()
  }
}
