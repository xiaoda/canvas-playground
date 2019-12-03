class Aerocraft {
  constructor (options = {}) {
    this.radius = options.radius || 10
    this.weight = options.weight || 1
    this.position = options.position || [0, 0]
    this.acceleration = 0
    this.aRadian = 0
    this.velocity = 0
    this.vRadian = 0
  }
  applyForce (force) {
    const acceleration = force.quantity / this.weight
    const aRadian = force.radian
    // todo
  }
}

export default Aerocraft
