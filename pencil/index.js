import canvasUtils from './canvas/index.js'
import analysis from './analysis/index.js'

/* Configs */
const USE_PENCIL = 0

/* Constants */
const $canvas = $('#canvas')
window.canvas = $canvas.get(0)
window.ctx = canvas.getContext('2d')
const $clearButton = $('#clear')
const $backButton = $('#back')
const $forwardButton = $('#forward')
const $transformButtons = $('[data-transform]')

/* Variables */
let IS_TOUCHED = false

/* Events */
$canvas.on('touchstart', function (event) {
  const [touch] = event.touches
  const {touchType, clientX, clientY} = touch
  if (USE_PENCIL && touchType !== 'stylus') return
  IS_TOUCHED = true
  const point = canvasUtils.mapCoordinates([clientX, clientY])
  canvasUtils.connectPointsByPixel(point)
  canvasUtils.saveLastPoint(point)
  canvasUtils.clearLastSeriesPoints()
  canvasUtils.saveLastSeriesPoints(point)
})

$canvas.on('touchmove', function (event) {
  const [touch] = event.touches
  const {touchType, clientX, clientY} = touch
  if (USE_PENCIL && touchType !== 'stylus') return
  const point = canvasUtils.mapCoordinates([clientX, clientY])
  const lastPoint = canvasUtils.getLastPoint()
  canvasUtils.connectPointsByPixel(lastPoint, point)
  canvasUtils.saveLastPoint(point)
  canvasUtils.saveLastSeriesPoints(point)
})

$canvas.on('touchend', function (event) {
  if (!IS_TOUCHED) return
  IS_TOUCHED = false
  canvasUtils.saveImageDataHistory()
  analysis.inspectLastSeriesPoints()
  updateControls()
})

$clearButton.on('click', function () {
  canvasUtils.init()
  updateControls('init')
})

$backButton.on('click', function () {
  let currentHistoryIndex = canvasUtils.getCurrentHistoryIndex()
  if (currentHistoryIndex < 0) return
  currentHistoryIndex--
  canvasUtils.setCurrentHistoryIndex(currentHistoryIndex)
  canvasUtils.clearLastSeriesPoints()
  updateControls()
})

$forwardButton.on('click', function () {
  const imageDataHistory = canvasUtils.getImageDataHistory()
  let currentHistoryIndex = canvasUtils.getCurrentHistoryIndex()
  if (currentHistoryIndex >= imageDataHistory.length - 1) return
  currentHistoryIndex++
  canvasUtils.setCurrentHistoryIndex(currentHistoryIndex)
  updateControls()
})

$transformButtons.on('click', function () {
  const transform = $(this).data('transform')
  canvasUtils[transform]()
  canvasUtils.saveImageDataHistory()
  canvasUtils.clearLastSeriesPoints()
  updateControls()
})

/* Functions */
function updateControls (timing) {
  const imageDataHistory = canvasUtils.getImageDataHistory()
  const currentHistoryIndex = canvasUtils.getCurrentHistoryIndex()
  const lastSeriesPoints = canvasUtils.getLastSeriesPoints()
  const disabled = 'disabled'
  timing === 'init' ?
    $clearButton.attr({disabled}) :
    $clearButton.removeAttr('disabled')
  currentHistoryIndex > 0 ?
    $backButton.removeAttr('disabled') :
    $backButton.attr({disabled})
  currentHistoryIndex < imageDataHistory.length - 1 ?
    $forwardButton.removeAttr('disabled') :
    $forwardButton.attr({disabled})
  lastSeriesPoints.length ?
    $transformButtons.removeAttr('disabled') :
    $transformButtons.attr({disabled})
}

/* Init */
canvasUtils.init()
canvasUtils.setLineStyles()
