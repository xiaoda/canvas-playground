const canvas = $('canvas').get(0)
const ctx = canvas.getContext('2d')
const pageData = {
  fileName: '',
  history: []
}

$('#upload').on('change', function (e) {
  _setPageData({
    fileName: this.files[0].name
  })
  const image = new Image()
  image.onload = function () {
    _adjustCanvasSize(this.width, this.height)
    ctx.drawImage(this, 0, 0)
    _saveToHistory()
  }
  image.src = URL.createObjectURL(this.files[0])
})

$('[data-action]').on('click', function () {
  const action = $(this).data('action')
  if (window[action]) {
    window[action]()
    _saveToHistory()
  }
})

function _setPageData (dataObject) {
  Object.keys(dataObject).forEach(key => {
    pageData[key] = dataObject[key]
  })
}

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

function _saveToHistory () {
  const {history} = pageData
  history.push(_getImageData())
}

function back () {
  const {history} = pageData
  if (history.length > 1) {
    history.pop()
    const imageData = history[history.length - 1]
    _adjustCanvasSize(imageData.width, imageData.height)
    ctx.putImageData(imageData, 0, 0)
  }
}

function save () {
  const {fileName} = pageData
  const link = document.createElement('a')
  let type = fileName.match(/\.[^\.]+$/)[0].slice(1)
  switch (type) {
    case 'jpg':
      type = 'jpeg'
  }
  link.href = canvas.toDataURL(`image/${type}`)
  link.download = fileName
  link.click()
}

function hMirror () {
  const {data} = _getImageData()
  const distWidth = canvas.width
  const distHeight = canvas.height
  const distImageData = ctx.createImageData(distWidth, distHeight)
  for (let i = 0; i < distHeight; i++) {
    for (let j = 0; j < distWidth; j++) {
      const distIndex = (i * distWidth + j) * 4
      const index = (i * canvas.width + (canvas.width - j)) * 4
      distImageData.data[distIndex] = data[index]
      distImageData.data[distIndex + 1] = data[index + 1]
      distImageData.data[distIndex + 2] = data[index + 2]
      distImageData.data[distIndex + 3] = data[index + 3]
    }
  }
  _adjustCanvasSize(distWidth, distHeight)
  ctx.putImageData(distImageData, 0, 0)
}

function vMirror () {
  const {data} = _getImageData()
  const distWidth = canvas.width
  const distHeight = canvas.height
  const distImageData = ctx.createImageData(distWidth, distHeight)
  for (let i = 0; i < distHeight; i++) {
    for (let j = 0; j < distWidth; j++) {
      const distIndex = (i * distWidth + j) * 4
      const index = ((canvas.height - i) * canvas.width + j) * 4
      distImageData.data[distIndex] = data[index]
      distImageData.data[distIndex + 1] = data[index + 1]
      distImageData.data[distIndex + 2] = data[index + 2]
      distImageData.data[distIndex + 3] = data[index + 3]
    }
  }
  _adjustCanvasSize(distWidth, distHeight)
  ctx.putImageData(distImageData, 0, 0)
}

function rotateNegative90 () {
  const {data} = _getImageData()
  const distWidth = canvas.height
  const distHeight = canvas.width
  const distImageData = ctx.createImageData(distWidth, distHeight)
  for (let i = 0; i < distHeight; i++) {
    for (let j = 0; j < distWidth; j++) {
      const distIndex = (i * distWidth + j) * 4
      const index = (j * canvas.width + (canvas.width - i)) * 4
      distImageData.data[distIndex] = data[index]
      distImageData.data[distIndex + 1] = data[index + 1]
      distImageData.data[distIndex + 2] = data[index + 2]
      distImageData.data[distIndex + 3] = data[index + 3]
    }
  }
  _adjustCanvasSize(distWidth, distHeight)
  ctx.putImageData(distImageData, 0, 0)
}

function rotate90 () {
  const {data} = _getImageData()
  const distWidth = canvas.height
  const distHeight = canvas.width
  const distImageData = ctx.createImageData(distWidth, distHeight)
  for (let i = 0; i < distHeight; i++) {
    for (let j = 0; j < distWidth; j++) {
      const distIndex = (i * distWidth + j) * 4
      const index = ((canvas.height - j) * canvas.width + i) * 4
      distImageData.data[distIndex] = data[index]
      distImageData.data[distIndex + 1] = data[index + 1]
      distImageData.data[distIndex + 2] = data[index + 2]
      distImageData.data[distIndex + 3] = data[index + 3]
    }
  }
  _adjustCanvasSize(distWidth, distHeight)
  ctx.putImageData(distImageData, 0, 0)
}

function rotate180 () {
  const {data} = _getImageData()
  const distWidth = canvas.width
  const distHeight = canvas.height
  const distImageData = ctx.createImageData(distWidth, distHeight)
  for (let i = 0; i < distHeight; i++) {
    for (let j = 0; j < distWidth; j++) {
      const distIndex = (i * distWidth + j) * 4
      const index = ((canvas.height - i) * canvas.width + (canvas.width - j)) * 4
      distImageData.data[distIndex] = data[index]
      distImageData.data[distIndex + 1] = data[index + 1]
      distImageData.data[distIndex + 2] = data[index + 2]
      distImageData.data[distIndex + 3] = data[index + 3]
    }
  }
  _adjustCanvasSize(distWidth, distHeight)
  ctx.putImageData(distImageData, 0, 0)
}

function scale50 () {
  const {data} = _getImageData()
  const distWidth = Math.floor(canvas.width / 2)
  const distHeight = Math.floor(canvas.height / 2)
  const distImageData = ctx.createImageData(distWidth, distHeight)
  for (let i = 0; i < distHeight; i++) {
    for (let j = 0; j < distWidth; j++) {
      const distIndex = (i * distWidth + j) * 4
      const index = (i * 2 * canvas.width + j * 2) * 4
      distImageData.data[distIndex] = data[index]
      distImageData.data[distIndex + 1] = data[index + 1]
      distImageData.data[distIndex + 2] = data[index + 2]
      distImageData.data[distIndex + 3] = data[index + 3]
    }
  }
  _adjustCanvasSize(distWidth, distHeight)
  ctx.putImageData(distImageData, 0, 0)
}

function scale200 () {
  const {data} = _getImageData()
  const distWidth = canvas.width * 2
  const distHeight = canvas.height * 2
  const distImageData = ctx.createImageData(distWidth, distHeight)
  for (let i = 0; i < distHeight; i++) {
    for (let j = 0; j < distWidth; j++) {
      const distIndex = (i * distWidth + j) * 4
      const index = (Math.floor(i / 2) * canvas.width + Math.floor(j / 2)) * 4
      distImageData.data[distIndex] = data[index]
      distImageData.data[distIndex + 1] = data[index + 1]
      distImageData.data[distIndex + 2] = data[index + 2]
      distImageData.data[distIndex + 3] = data[index + 3]
    }
  }
  _adjustCanvasSize(distWidth, distHeight)
  ctx.putImageData(distImageData, 0, 0)
}

function gray () {
  const imageData = _getImageData()
  const {data} = imageData
  const ratio = {r: .3, g: .59, b: .11}
  // const ratio = {r: 1 / 3, g: 1 / 3, b: 1 / 3}
  for (let i = 0; i < data.length; i += 4) {
    const gray = ratio.r * data[i] + ratio.g * data[i + 1] + ratio.b * data[i + 2]
    // const gray = Math.max(data[i], data[i + 1], data[i + 2])
    // const gray = Math.min(data[i], data[i + 1], data[i + 2])
    data[i] = data[i + 1] = data[i + 2] = gray
  }
  ctx.putImageData(imageData, 0, 0)
}

function decreaseSaturation () {
  const imageData = _getImageData()
  const {data} = imageData
  for (let i = 0; i < data.length; i += 4) {
    const color = tinycolor({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2]
    })
    const hsl = color.toHsl()
    hsl.s -= hsl.s * .15
    const newColor = tinycolor(hsl)
    const newRgb = newColor.toRgb()
    data[i] = newRgb.r
    data[i + 1] = newRgb.g
    data[i + 2] = newRgb.b
  }
  ctx.putImageData(imageData, 0, 0)
}

function increaseSaturation () {
  const imageData = _getImageData()
  const {data} = imageData
  for (let i = 0; i < data.length; i += 4) {
    const color = tinycolor({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2]
    })
    const hsl = color.toHsl()
    hsl.s += (1 - hsl.s) * .15
    const newColor = tinycolor(hsl)
    const newRgb = newColor.toRgb()
    data[i] = newRgb.r
    data[i + 1] = newRgb.g
    data[i + 2] = newRgb.b
  }
  ctx.putImageData(imageData, 0, 0)
}

function decreaseLightness () {
  const imageData = _getImageData()
  const {data} = imageData
  for (let i = 0; i < data.length; i += 4) {
    const color = tinycolor({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2]
    })
    const hsl = color.toHsl()
    hsl.l -= hsl.l * .15
    const newColor = tinycolor(hsl)
    const newRgb = newColor.toRgb()
    data[i] = newRgb.r
    data[i + 1] = newRgb.g
    data[i + 2] = newRgb.b
  }
  ctx.putImageData(imageData, 0, 0)
}

function increaseLightness () {
  const imageData = _getImageData()
  const {data} = imageData
  for (let i = 0; i < data.length; i += 4) {
    const color = tinycolor({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
    })
    const hsl = color.toHsl()
    hsl.l += (1 - hsl.l) * .15
    const newColor = tinycolor(hsl)
    const newRgb = newColor.toRgb()
    data[i] = newRgb.r
    data[i + 1] = newRgb.g
    data[i + 2] = newRgb.b
  }
  ctx.putImageData(imageData, 0, 0)
}

function gaussianBlur () {
  const {data} = _getImageData()
  const distWidth = canvas.width
  const distHeight = canvas.height
  const distImageData = ctx.createImageData(distWidth, distHeight)
  const blurRadius = 3
  const weightArr = [[.017720970363209305,.018995329801383735,.01980352229749583,.0200804901539137,.01980352229749583,.018995329801383735,.017720970363209305],[.018995329801383735,.020361331623941128,.021227643270086926,.021524528579932166,.021227643270086926,.020361331623941128,.018995329801383735],[.01980352229749583,.021227643270086926,.02213081379570627,.022440330656681804,.02213081379570627,.021227643270086926,.01980352229749583],[.0200804901539137,.021524528579932166,.022440330656681804,.022754176354730947,.022440330656681804,.021524528579932166,.0200804901539137],[.01980352229749583,.021227643270086926,.02213081379570627,.022440330656681804,.02213081379570627,.021227643270086926,.01980352229749583],[.018995329801383735,.020361331623941128,.021227643270086926,.021524528579932166,.021227643270086926,.020361331623941128,.018995329801383735],[.017720970363209305,.018995329801383735,.01980352229749583,.0200804901539137,.01980352229749583,.018995329801383735,.017720970363209305]]
  for (let i = 0; i < distHeight; i++) {
    for (let j = 0; j < distWidth; j++) {
      const index = (i * distWidth + j) * 4
      let red = 0, green = 0, blue = 0, alpha = 0
      for (let k = 0; k < blurRadius * 2 + 1; k++) {
        let x = i + k - blurRadius
        if (x < 0) {
          x *= -1
        } else if (x > distHeight - 1) {
          x = (distHeight - 1) * 2 - x
        }
        for (let l = 0; l < blurRadius * 2 + 1; l++) {
          let y = j + l - blurRadius
          if (y < 0) {
            y *= -1
          } else if (y > distWidth - 1) {
            y = (distWidth - 1) * 2 - y
          }
          const index = (x * distWidth + y) * 4
          const weight = weightArr[k][l]
          red += data[index] * weight
          green += data[index + 1] * weight
          blue += data[index + 2] * weight
          alpha += data[index + 3] * weight
        }
      }
      distImageData.data[index] = red
      distImageData.data[index + 1] = green
      distImageData.data[index + 2] = blue
      distImageData.data[index + 3] = alpha
    }
  }
  _adjustCanvasSize(distWidth, distHeight)
  ctx.putImageData(distImageData, 0, 0)
}
