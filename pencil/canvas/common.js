import config from './config.js'

let IMAGE_DATA_HISTORY
let CURRENT_HISTORY_INDEX
let LAST_POINT
let LAST_SERIES_POINTS

export default {
  /* Base */
  init () {
    IMAGE_DATA_HISTORY = []
    CURRENT_HISTORY_INDEX = 0
    LAST_POINT = []
    LAST_SERIES_POINTS = []

    window.canvas.style.width = `${window.innerWidth}px`
    window.canvas.style.height = `${window.innerHeight}px`
    window.canvas.width = window.innerWidth * config.CANVAS_RATIO
    window.canvas.height = window.innerHeight * config.CANVAS_RATIO
    window.ctx.fillStyle = '#FFF'
    window.ctx.fillRect(
      0, 0,
      window.canvas.width,
      window.canvas.height
    )
    this.saveImageDataHistory()
  },
  setLineStyles (options = {}) {
    window.ctx.lineWidth = (
      options.lineWidth ||
      (config.LINE_WIDTH + config.SHADOW_RANGE)
    )
    window.ctx.lineCap = options.lineCap || 'round'
    window.ctx.lineJoin = options.lineJoin || 'round'
    window.ctx.strokeStyle = options.strokeStyle || '#222'
  },
  mapCoordinates (point) {
    const ratio = config.CANVAS_RATIO
    point = point.map(coordinate => coordinate * ratio)
    return point
  },

  /* History */
  getImageDataHistory () {
    return IMAGE_DATA_HISTORY
  },
  saveImageDataHistory (imageData) {
    imageData = imageData ? imageData : (
      window.ctx.getImageData(
        0, 0,
        window.canvas.width,
        window.canvas.height
      )
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
  getCurrentHistoryIndex () {
    return CURRENT_HISTORY_INDEX
  },
  setCurrentHistoryIndex (index) {
    CURRENT_HISTORY_INDEX = index
    const imageDataHistory = this.getImageDataHistory()
    const imageData = imageDataHistory[index]
    window.ctx.putImageData(imageData, 0, 0)
  },

  /* Last point */
  getLastPoint () {
    return LAST_POINT
  },
  saveLastPoint (point) {
    LAST_POINT = point
  },

  /* Last series points */
  getLastSeriesPoints () {
    return LAST_SERIES_POINTS
  },
  saveLastSeriesPoints (point) {
    LAST_SERIES_POINTS.push(point)
  },
  updateLastSeriesPoints (points) {
    LAST_SERIES_POINTS = points
  },
  clearLastSeriesPoints () {
    LAST_SERIES_POINTS = []
  }
}
