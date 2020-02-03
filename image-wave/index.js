/* Constants */
const $canvas = $('#image')
const canvas = $canvas.get(0)
const ctx = canvas.getContext('2d')
const pageData = {
  rowColors: {red: [], green: [], blue: []},
  columnColors: {red: [], green: [], blue: []},
  throttleInterval: 50,
  reloadTime: 500,
  fileName: null,
  initialImageData: null,
  tempImageData: null,
  rowColorsChart: null,
  columnColorsChart: null,
  chartsWindow: null,
  reloadTimeout: null
}
const slowlyUpdateChartsDynamic = GeometryUtils.throttle(
  updateChartsDynamic, pageData.throttleInterval
)
const slowlyPostUpdateDynamicMessage = GeometryUtils.throttle(
  postUpdateDynamicMessage, pageData.throttleInterval
)
const channel = new BroadcastChannel('image-wave')

$(window).on('load', function () {
  channel.postMessage({
    status: 'check'
  })
})

$(window).on('unload', function () {
  channel.postMessage({
    status: 'close'
  })
})

$('#upload').on('change', function () {
  _setPageData({
    fileName: this.files[0].name
  })
  const image = new Image()
  $(image).on('load', function () {
    _adjustCanvasSize(this.width, this.height)
    ctx.drawImage(this, 0, 0)
    _setPageData({
      initialImageData: _getInitialImageData(),
      tempImageData: _getTempImageData()
    })
    initCharts()
    postInitMessage()
  })
  image.src = URL.createObjectURL(this.files[0])
})

$('#toggleChartsWindow').on('click', function () {
  const {chartsWindow} = pageData
  if (chartsWindow) {
    chartsWindow.close()
  } else {
    _setPageData({
      chartsWindow: window.open(`./charts.html?${+new Date()}`)
    })
  }
})

$canvas.on('click', function (event) {
  const {rowColors, columnColors} = pageData
  const imageData = _getInitialImageData()
  const {width, height, data} = imageData
  const row = GeometryUtils.clamp(0, height - 1, event.offsetY)
  const column = GeometryUtils.clamp(0, width - 1, event.offsetX)
  const highlightAmount = .7
  rowColors.red = []
  rowColors.green = []
  rowColors.blue = []
  columnColors.red = []
  columnColors.green = []
  columnColors.blue = []

  /* Store row color wave */
  for (let i = row * width; i < (row + 1) * width; i++) {
    const index = i * 4
    rowColors.red.push(data[index])
    rowColors.green.push(data[index + 1])
    rowColors.blue.push(data[index + 2])
  }

  /* Store column color wave */
  for (let i = column; i < width * height; i += width) {
    const index = i * 4
    columnColors.red.push(data[index])
    columnColors.green.push(data[index + 1])
    columnColors.blue.push(data[index + 2])
  }
  postColorsMessage()

  /* Highlight row pixels */
  for (let i = row * width; i < (row + 1) * width; i++) {
    const index = i * 4
    data[index] = GeometryUtils.changeByPercent(data[index], 255, highlightAmount)
    data[index + 1] = GeometryUtils.changeByPercent(data[index + 1], 255, highlightAmount)
    data[index + 2] = GeometryUtils.changeByPercent(data[index + 2], 255, highlightAmount)
  }

  /* Highlight column pixels */
  for (let i = column; i < width * height; i += width) {
    const index = i * 4
    data[index] = GeometryUtils.changeByPercent(data[index], 255, highlightAmount)
    data[index + 1] = GeometryUtils.changeByPercent(data[index + 1], 255, highlightAmount)
    data[index + 2] = GeometryUtils.changeByPercent(data[index + 2], 255, highlightAmount)
  }
  ctx.putImageData(imageData, 0, 0)
  _setPageData({
    tempImageData: null
  })
  _setPageData({
    tempImageData: _getTempImageData()
  })
  updateChartsData()
  postUpdateMessage()
  updateChartsStatic(row, column)
  postUpdateStaticMessage(row, column)
  slowlyUpdateChartsDynamic(row, column)
  slowlyPostUpdateDynamicMessage(row, column)
})

$canvas.on('mousemove', function (event) {
  const imageData = _getTempImageData()
  const {width, height, data} = imageData
  const row = GeometryUtils.clamp(0, height - 1, event.offsetY)
  const column = GeometryUtils.clamp(0, width - 1, event.offsetX)
  const highlightColor = [255, 102, 0]

  /* Highlight row pixels */
  for (let i = row * width; i < (row + 1) * width; i++) {
    const index = i * 4
    data[index] = highlightColor[0]
    data[index + 1] = highlightColor[1]
    data[index + 2] = highlightColor[2]
  }

  /* Highlight column pixels */
  for (let i = column; i < width * height; i += width) {
    const index = i * 4
    data[index] = highlightColor[0]
    data[index + 1] = highlightColor[1]
    data[index + 2] = highlightColor[2]
  }
  ctx.putImageData(imageData, 0, 0)
  slowlyUpdateChartsDynamic(row, column)
  slowlyPostUpdateDynamicMessage(row, column)
})

$canvas.on('mouseleave', function () {
  _getTempImageData()
  clearChartsDynamic()
  postClearDynamicMessage()
})

function _setPageData (dataObject) {
  Object.keys(dataObject).forEach(key => {
    pageData[key] = dataObject[key]
  })
}

function _adjustCanvasSize (width, height) {
  canvas.width = canvas.style.width = width
  canvas.height = canvas.style.height = height
}

function _getTempImageData (
  sx = 0, sy = 0,
  sw = canvas.width,
  sh = canvas.height
) {
  const {tempImageData} = pageData
  if (tempImageData) ctx.putImageData(tempImageData, 0, 0)
  return ctx.getImageData(sx, sy, sw, sh)
}

function _getInitialImageData (
  sx = 0, sy = 0,
  sw = canvas.width,
  sh = canvas.height
) {
  const {initialImageData} = pageData
  if (initialImageData) ctx.putImageData(initialImageData, 0, 0)
  return ctx.getImageData(sx, sy, sw, sh)
}

/* Communication */
channel.onmessage = function (event) {
  const {
    reloadTimeout, reloadTime
  } = pageData
  const data = event.data
  console.info('message', data)
  switch (data.status) {
    case 'load':
      clearTimeout(reloadTimeout)
      postInitMessage()
      postColorsMessage()
      postUpdateMessage()
      postUpdateStaticMessage()
      postUpdateDynamicMessage()

    case 'confirm':
      $('#rowColors, #columnColors').hide()
      $('#toggleChartsWindow').text('Close Charts Window')
      break

    case 'unload':
      _setPageData({
        reloadTimeout: setTimeout(_ => {
          _setPageData({
            chartsWindow: null
          })
          $('#rowColors, #columnColors').show()
          $('#toggleChartsWindow').text('Open Charts Window')
        }, reloadTime)
      })
      break
  }
}

function postInitMessage () {
  const {initialImageData} = pageData
  if (!initialImageData) return
  channel.postMessage({
    status: 'init',
    width: canvas.width,
    height: canvas.height
  })
}

function postColorsMessage () {
  const {
    initialImageData, rowColors, columnColors
  } = pageData
  if (!initialImageData) return
  channel.postMessage({
    status: 'colors',
    rowColors,
    columnColors
  })
}

function postUpdateMessage () {
  const {initialImageData} = pageData
  if (!initialImageData) return
  channel.postMessage({
    status: 'update'
  })
}

function postUpdateStaticMessage (row, column) {
  const {initialImageData} = pageData
  if (!initialImageData) return
  channel.postMessage({
    status: 'updateStatic',
    row,
    column
  })
}

function postUpdateDynamicMessage (row, column) {
  const {initialImageData} = pageData
  if (!initialImageData) return
  channel.postMessage({
    status: 'updateDynamic',
    row,
    column
  })
}

function postClearDynamicMessage () {
  const {initialImageData} = pageData
  if (!initialImageData) return
  channel.postMessage({
    status: 'clearDynamic'
  })
}
