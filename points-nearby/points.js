class Point {
  constructor (options = {}) {
    this.buffer = options.buffer || 1
    this.position = options.position || [0, 0]
    this.color = options.color || '#999'
  }
}

class ClosePoint extends Point {
  constructor (options = {}) {
    super({
      buffer: 10,
      position: options.position,
      color: '#F39C12'
    })
  }
}

class MediumPoint extends Point {
  constructor (options = {}) {
    super({
      buffer: 30,
      position: options.position,
      color: '#1ABC9C'
    })
  }
}

class DistantPoint extends Point {
  constructor (options = {}) {
    super({
      buffer: 50,
      position: options.position,
      color: '#3498DB'
    })
  }
}

export default {
  Point,
  ClosePoint,
  MediumPoint,
  DistantPoint
}
