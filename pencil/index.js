/* Configs */
const USE_PENCIL = 0

/* Constants */
const $canvas = $('#canvas')
const canvas = $canvas.get(0)
const ctx = canvas.getContext('2d')
const $clearButton = $('#clear')
const $backButton = $('#back')
const $forwardButton = $('#forward')
const $smoothButton = $('#smooth')

/* Events */
$canvas.on('touchstart', function (event) {
  const [touch] = event.touches
  const {touchType, clientX, clientY} = touch
  if (USE_PENCIL && touchType !== 'stylus') return
  const point = CanvasUtils.mapCoordinates([clientX, clientY])
  CanvasUtils.connectPointsByPixel(point)
  CanvasUtils.saveLastPoint(point)
  CanvasUtils.clearLastSeriesPoints()
  CanvasUtils.saveLastSeriesPoints(point)
})

$canvas.on('touchmove', function (event) {
  const [touch] = event.touches
  const {touchType, clientX, clientY} = touch
  if (USE_PENCIL && touchType !== 'stylus') return
  const point = CanvasUtils.mapCoordinates([clientX, clientY])
  const lastPoint = CanvasUtils.getLastPoint()
  CanvasUtils.connectPointsByPixel(lastPoint, point)
  CanvasUtils.saveLastPoint(point)
  CanvasUtils.saveLastSeriesPoints(point)
})

$canvas.on('touchend', function (event) {
  CanvasUtils.saveImageDataHistory()
  updateControls()
})

$clearButton.on('click', function (event) {
  CanvasUtils.init()
  updateControls('init')
})

$backButton.on('click', function (event) {
  let currentHistoryIndex = CanvasUtils.getCurrentHistoryIndex()
  if (currentHistoryIndex < 0) return
  currentHistoryIndex --
  CanvasUtils.setCurrentHistoryIndex(currentHistoryIndex)
  CanvasUtils.clearLastSeriesPoints()
  updateControls()
})

$forwardButton.on('click', function (event) {
  const imageDataHistory = CanvasUtils.getImageDataHistory()
  let currentHistoryIndex = CanvasUtils.getCurrentHistoryIndex()
  if (currentHistoryIndex >= imageDataHistory.length - 1) return
  currentHistoryIndex ++
  CanvasUtils.setCurrentHistoryIndex(currentHistoryIndex)
  updateControls()
})

$smoothButton.on('click', function (event) {
  CanvasUtils.smoothLastLine()
  CanvasUtils.saveImageDataHistory()
  CanvasUtils.clearLastSeriesPoints()
  updateControls()
})

/* Functions */
function updateControls (timing) {
  const imageDataHistory = CanvasUtils.getImageDataHistory()
  const currentHistoryIndex = CanvasUtils.getCurrentHistoryIndex()
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
  const lastSeriesPoints = CanvasUtils.getLastSeriesPoints()
  lastSeriesPoints.length ?
    $smoothButton.removeAttr('disabled') :
    $smoothButton.attr({disabled})
}

/* Init */
CanvasUtils.init()
CanvasUtils.setLineStyles()
