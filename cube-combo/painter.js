class Painter {
  constructor (options = {}) {
    this.ctx = options.ctx
    this.canvasSize = options.canvasSize || {}
    this.cubeSize = options.cubeSize || 10
    this.borderSize = options.borderSize || 1
    this.borderColor = options.borderColor || '#666'
  }

  updateStyle (options = {}) {
    Object.keys(options).forEach(styleKey => {
      const styleValue = options[styleKey]
      if (!this[styleKey]) return
      this[styleKey] = styleValue
    })
  }

  drawCubeFace (cubeCombo, direction) {
    const cubes = cubeCombo[`get${direction}Look`]()
    this.clearCanvas()
    this.ctx.lineWidth = this.borderSize
    this.ctx.strokeStyle = this.borderColor
    cubes.forEach(cube => {
      const midPoint = this._formatCoordinate(
        ...cube.map(coordinate => coordinate * this.cubeSize)
      )
      const position = [
        midPoint[0] - this.cubeSize * .5,
        midPoint[1] - this.cubeSize * .5
      ]
      this.ctx.strokeRect(
        position[0],
        position[1],
        this.cubeSize,
        this.cubeSize
      )
    })
  }

  clearCanvas () {
    this.ctx.clearRect(
      0, 0,
      this.canvasSize.width,
      this.canvasSize.height
    )
  }

  _formatCoordinate (x, y) {
    return [
      this.canvasSize.width * .5 + x,
      this.canvasSize.height * .5 - y
    ]
  }
}

export default Painter
