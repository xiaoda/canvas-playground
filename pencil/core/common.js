import config from '../config.js'

let _imageDataHistory
let _currentHistoryIndex
let _lastPoint
let _lastSeriesPoints

export default {
  init () {
    _imageDataHistory = []
    _currentHistoryIndex = 0
    _lastPoint = []
    _lastSeriesPoints = []

    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    canvas.width = window.innerWidth * config.canvasRatio
    canvas.height = window.innerHeight * config.canvasRatio
    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    this.saveImageDataHistory()
  },

  setLineStyles (options = {}) {
    ctx.lineWidth = (
      options.lineWidth ||
      (config.lineWidth + config.shadowRange)
    )
    ctx.lineCap = options.lineCap || 'round'
    ctx.lineJoin = options.lineJoin || 'round'
    ctx.strokeStyle = options.strokeStyle || '#222'
  },

  mapCoordinates (point) {
    const ratio = config.canvasRatio
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
  }
}
