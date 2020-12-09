import config from '../config.js'

let IMAGE_DATA_HISTORY
let CURRENT_HISTORY_INDEX
let LAST_POINT
let LAST_SERIES_POINTS

export default {
  init () {
    IMAGE_DATA_HISTORY = []
    CURRENT_HISTORY_INDEX = 0
    LAST_POINT = []
    LAST_SERIES_POINTS = []

    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    canvas.width = window.innerWidth * config.CANVAS_RATIO
    canvas.height = window.innerHeight * config.CANVAS_RATIO
    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    this.saveImageDataHistory()
  },

  setLineStyles (options = {}) {
    ctx.lineWidth = (
      options.lineWidth ||
      (config.LINE_WIDTH + config.SHADOW_RANGE)
    )
    ctx.lineCap = options.lineCap || 'round'
    ctx.lineJoin = options.lineJoin || 'round'
    ctx.strokeStyle = options.strokeStyle || '#222'
  },

  mapCoordinates (point) {
    const ratio = config.CANVAS_RATIO
    point = point.map(coordinate => coordinate * ratio)
    return point
  },

  saveImageDataHistory (imageData) {
    imageData = imageData ? imageData : (
      ctx.getImageData(0, 0, canvas.width, canvas.height)
    )
    let currentHistoryIndex = this.getCurrentHistoryIndex()
    IMAGE_DATA_HISTORY.splice(
      currentHistoryIndex + 1,
      IMAGE_DATA_HISTORY.length
    )
    currentHistoryIndex = (
      IMAGE_DATA_HISTORY.push(imageData) - 1
    )
    this.setCurrentHistoryIndex(currentHistoryIndex)
  },

  getImageDataHistory () {
    return IMAGE_DATA_HISTORY
  },

  setCurrentHistoryIndex (index) {
    CURRENT_HISTORY_INDEX = index
    const imageDataHistory = this.getImageDataHistory()
    const imageData = imageDataHistory[index]
    ctx.putImageData(imageData, 0, 0)
  },

  getCurrentHistoryIndex () {
    return CURRENT_HISTORY_INDEX
  },

  saveLastPoint (point) {
    LAST_POINT = point
  },

  getLastPoint () {
    return LAST_POINT
  },

  clearLastSeriesPoints () {
    LAST_SERIES_POINTS = []
  },

  saveLastSeriesPoints (point) {
    LAST_SERIES_POINTS.push(point)
  },

  getLastSeriesPoints () {
    return LAST_SERIES_POINTS
  }
}
