const $canvas = $('#canvas')
const canvas = $canvas.get(0)
const ctx = canvas.getContext('2d')

function initCanvas () {
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`
  canvas.width = window.innerWidth * 2
  canvas.height = window.innerHeight * 2
}

$canvas.on('touchstart', function (event) {
  console.log(event)
})

$canvas.on('touchmove', function (event) {
  // console.log(event)
})

initCanvas()
