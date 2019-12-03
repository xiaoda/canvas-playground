class Axle {
  constructor (options = {}) {
    this.options = {...options}
    this.setPositions(...options.positions)
  }
  setPositions (frontWheelPosition, rearWheelPosition) {
    this.positions = [frontWheelPosition, rearWheelPosition]
    this.draw()
  }
  draw () {
    window.ctx.lineWidth = 2
    window.ctx.strokeStyle = this.options.strokeStyle
    window.ctx.setLineDash([])
    window.ctx.beginPath()
    window.ctx.moveTo(...this.positions[0])
    window.ctx.lineTo(...this.positions[1])
    window.ctx.closePath()
    window.ctx.stroke()
  }
}

export default Axle
