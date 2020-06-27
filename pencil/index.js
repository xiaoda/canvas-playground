/* Configs */
const USE_PENCIL = 1

/* Constants */
const $canvas = $('#canvas')
const canvas = $canvas.get(0)
const ctx = canvas.getContext('2d')

/* Init */
CanvasUtils.initCanvas()
CanvasUtils.setLineStyles()

$canvas.on('touchstart', function (event) {
  const [touch] = event.touches
  const {touchType, clientX, clientY} = touch
  if (USE_PENCIL && touchType !== 'stylus') return
  const point = CanvasUtils.mapCoordinates([clientX, clientY])
  CanvasUtils.connectPoints(point)
  CanvasUtils.saveLastPoint(point)
})

$canvas.on('touchmove', function (event) {
  const [touch] = event.touches
  const {touchType, clientX, clientY} = touch
  if (USE_PENCIL && touchType !== 'stylus') return
  const point = CanvasUtils.mapCoordinates([clientX, clientY])
  const lastPoint = CanvasUtils.getLastPoint()
  CanvasUtils.connectPoints(lastPoint, point)
  CanvasUtils.saveLastPoint(point)
})