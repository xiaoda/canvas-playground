const canvas = $('canvas').get(0)
const ctx = canvas.getContext('2d')
const pageData = {
  fileName: ''
}

$('#upload').on('change', function (e) {
  pageData.fileName = this.files[0].name
  const image = new Image()
  image.onload = function () {
    _adjustCanvasSize(this.width, this.height)
    ctx.drawImage(this, 0, 0)
  }
  image.src = URL.createObjectURL(this.files[0])
})

$('[data-action]').on('click', function () {
  const action = $(this).data('action')
  window[action] && window[action]()
})

function _adjustCanvasSize (width, height) {
  canvas.width = width
  canvas.height = height
  canvas.style.width = `${canvas.width / window.devicePixelRatio}px`
  canvas.style.height = `${canvas.height / window.devicePixelRatio}px`
}

function _getImageData (
  sx = 0, sy = 0,
  sw = canvas.width,
  sh = canvas.height
) {
  return ctx.getImageData(sx, sy, sw, sh)
}

function sobel () {
  const imageData = _getImageData()
  const {width, height, data} = imageData
  const grayData = []
  const ratio = {r: .3, g: .59, b: .11}
  // const ratio = {r: 1 / 3, g: 1 / 3, b: 1 / 3}
  for (let i = 0; i < data.length; i += 4) {
    const gray = ratio.r * data[i] + ratio.g * data[i + 1] + ratio.b * data[i + 2]
    // const gray = Math.max(data[i], data[i + 1], data[i + 2])
    // const gray = Math.min(data[i], data[i + 1], data[i + 2])
    grayData.push(gray)
  }
  const radius = 1
  const xWeightArr = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ]
  const yWeightArr = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ]
  /*
  const xWeightArr = [
    [-3, 0, 3],
    [-10, 0, 10],
    [-3, 0, 3]
  ]
  const yWeightArr = [
    [-3, -10, -3],
    [0, 0, 0],
    [3, 10, 3]
  ]
  */
  const grayX = []
  const grayY = []
  Array(
    [xWeightArr, grayX],
    [yWeightArr, grayY]
  ).forEach(([weightArr, grayDirection]) => {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const index = i * width + j
        let gray = 0
        for (let k = 0; k < radius * 2 + 1; k++) {
          let x = i + k - radius
          if (x < 0) {
            x *= -1
          } else if (x > height - 1) {
            x = (height - 1) * 2 - x
          }
          for (let l = 0; l < radius * 2 + 1; l++) {
            let y = j + l - radius
            if (y < 0) {
              y *= -1
            } else if (y > width - 1) {
              y = (width - 1) * 2 - y
            }
            const index = x * width + y
            const weight = weightArr[k][l]
            gray += grayData[index] * weight
          }
        }
        gray = GeometryUtils.clamp(0, 255, Math.round(Math.abs(gray)))
        grayDirection.push(gray)
      }
    }
  })
  for (let i = 0; i < grayData.length - 1; i++) {
    const index = i * 4
    data[index] =
    data[index + 1] =
    data[index + 2] =
      (grayX[i] ** 2 + grayY[i] ** 2) ** .5
      // Math.max(grayX[i] + grayY[i])
    data[index + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
}

function laplace () {
  const imageData = _getImageData()
  const {width, height, data} = imageData
  const grayData = []
  const ratio = {r: .3, g: .59, b: .11}
  // const ratio = {r: 1 / 3, g: 1 / 3, b: 1 / 3}
  for (let i = 0; i < data.length; i += 4) {
    const gray = ratio.r * data[i] + ratio.g * data[i + 1] + ratio.b * data[i + 2]
    // const gray = Math.max(data[i], data[i + 1], data[i + 2])
    // const gray = Math.min(data[i], data[i + 1], data[i + 2])
    grayData.push(gray)
  }
  const radius = 1
  const weightArr = [
    [1, 1, 1],
    [1, -8, 1],
    [1, 1, 1]
  ]
  const newGrayData = []
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const index = i * width + j
      let gray = 0
      for (let k = 0; k < radius * 2 + 1; k++) {
        let x = i + k - radius
        if (x < 0) {
          x *= -1
        } else if (x > height - 1) {
          x = (height - 1) * 2 - x
        }
        for (let l = 0; l < radius * 2 + 1; l++) {
          let y = j + l - radius
          if (y < 0) {
            y *= -1
          } else if (y > width - 1) {
            y = (width - 1) * 2 - y
          }
          const index = x * width + y
          const weight = weightArr[k][l]
          gray += grayData[index] * weight
        }
      }
      gray = GeometryUtils.clamp(0, 255, Math.round(Math.abs(gray)))
      newGrayData.push(gray)
    }
  }
  for (let i = 0; i < grayData.length - 1; i++) {
    const index = i * 4
    data[index] =
    data[index + 1] =
    data[index + 2] = newGrayData[i]
    data[index + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
}
