function _capitalize (str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`
}

function initCharts (width, height) {
  if (!width) {
    const initialImageData = _getInitialImageData()
    width = initialImageData.width
    height = initialImageData.height
  }
  const rowColorsCtx = $('#rowColors')
  const columnColorsCtx = $('#columnColors')
  const rowOptions = {
    type: 'bar',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      title: {
        display: true,
        text: 'Row Wave'
      },
      scales: {
        xAxes: [{
          barThickness: 1
        }],
        yAxes: [{
          ticks: {
            max: 255,
            stepSize: 51
          }
        }]
      },
      animation: {duration: 0},
      hover: {animationDuration: 0},
      responsiveAnimationDuration: 0
    }
  }
  const columnOptions = GeometryUtils.clone(rowOptions)
  columnOptions.options.title.text = 'Column Wave'
  for (let i = 0; i < width; i++) {
    rowOptions.data.labels.push(String(i))
  }
  for (let i = 0; i < height; i++) {
    columnOptions.data.labels.push(String(i))
  }
  _setPageData({
    rowColorsChart: new Chart(rowColorsCtx, rowOptions),
    columnColorsChart: new Chart(columnColorsCtx, columnOptions)
  })
}

function destroyCharts () {
  _setPageData({
    rowColorsChart: null,
    columnColorsChart: null
  })
  $('#rowColors, #columnColors').attr({
    width: 5,
    height: 2
  })
}

/* Update color wave chart */
function updateChartsData () {
  const {
    rowColors, columnColors,
    rowColorsChart, columnColorsChart
  } = pageData
  rowColorsChart.data.datasets = []
  columnColorsChart.data.datasets = []
  const borderColorMap = {
    red: 'rgb(255, 51, 51)',
    green: 'rgb(51, 255, 51)',
    blue: 'rgb(51, 51, 255)'
  }
  const backgroundColorMap = {
    red: 'rgba(255, 51, 51, .15)',
    green: 'rgba(51, 255, 51, .15)',
    blue: 'rgba(51, 51, 255, .15)'
  }
  Array(
    [rowColors, rowColorsChart],
    [columnColors, columnColorsChart]
  ).forEach(([colors, colorsChart]) => {
    Object.keys(colors).forEach(color => {
      colorsChart.data.datasets.push({
        label: _capitalize(color),
        data: colors[color],
        pointRadius: 0,
        borderWidth: 2,
        borderColor: borderColorMap[color],
        backgroundColor: backgroundColorMap[color],
        type: 'line'
      })
    })
  })
  rowColorsChart.update()
  columnColorsChart.update()
}

/* Update chosen position wave on chart */
function updateChartsStatic (row, column) {
  const {
    rowColorsChart, columnColorsChart
  } = pageData
  const highlightColor = 'rgba(0, 0, 0, .7)'
  Array(
    [rowColorsChart, column],
    [columnColorsChart, row]
  ).forEach(([chart, position]) => {
    const data = Array(chart.data.datasets[0].data.length).fill(0)
    data[position] = 255
    chart.data.datasets.unshift({
      label: 'Static',
      data,
      backgroundColor: highlightColor,
      borderWidth: 0
    })
  })
  rowColorsChart.update()
  columnColorsChart.update()
}

/* Update hover position wave on chart */
function updateChartsDynamic (row, column) {
  const {
    rowColorsChart, columnColorsChart
  } = pageData
  if (!rowColorsChart.data.datasets.length) return
  if (rowColorsChart.data.datasets.length > 4) {
    rowColorsChart.data.datasets.shift()
    columnColorsChart.data.datasets.shift()
  }
  const highlightColor = 'rgb(255, 102, 0)'
  Array(
    [rowColorsChart, column],
    [columnColorsChart, row]
  ).forEach(([chart, position]) => {
    const data = Array(chart.data.datasets[0].data.length).fill(0)
    data[position] = 255
    chart.data.datasets.unshift({
      label: 'Active',
      data,
      backgroundColor: highlightColor,
      borderWidth: 0,
    })
  })
  rowColorsChart.update()
  columnColorsChart.update()
}

/* Clear hover position wave on chart */
function clearChartsDynamic () {
  const {
    rowColorsChart, columnColorsChart,
    throttleInterval
  } = pageData
  if (!rowColorsChart.data.datasets.length) return
  setTimeout(_ => {
    if (rowColorsChart.data.datasets.length > 4) {
      rowColorsChart.data.datasets.shift()
      columnColorsChart.data.datasets.shift()
    }
    const highlightColor = 'rgb(255, 102, 0)'
    Array(
      rowColorsChart, columnColorsChart
    ).forEach(chart => {
      const data = Array(chart.data.datasets[0].data.length).fill(0)
      chart.data.datasets.unshift({
        label: 'Active',
        data,
        backgroundColor: highlightColor,
        borderWidth: 0,
      })
    })
    rowColorsChart.update()
    columnColorsChart.update()
  }, throttleInterval)
}
