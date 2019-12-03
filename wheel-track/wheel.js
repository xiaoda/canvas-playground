class Wheel {
  constructor (options = {}) {
    this.options = {...options}
    this.positions = []
    this.setPosition(options.position)
  }
  setPosition (position = midpoint) {
    this.position = position
    this.positions.push(this.position)
    this.draw()
  }
  draw () {
    window.ctx.fillStyle = this.options.fillStyle
    this.positions.forEach(position => {
      window.ctx.beginPath()
      window.ctx.arc(...position, 1, 0, Math.PI * 2)
      window.ctx.closePath()
      window.ctx.fill()
    })
  }
}

export default Wheel
