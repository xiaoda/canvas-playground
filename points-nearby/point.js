class Point {
  constructor (options = {}) {
    this.color = options.color || '#999'
    this.distance = options.distance || 1
    this.position = options.position || [0, 0]
  }
}

class ClosePoint extends Point {
  constructor (options = {}) {
    super({
      color: '#F39C12',
      distance: 10,
      position: options.position
    })
  }
}

class MidPoint extends Point {
  constructor (options = {}) {
    super({
      color: '#1ABC9C',
      distance: 30,
      position: options.position
    })
  }
}

class RemotePoint extends Point {
  constructor (options = {}) {
    super({
      color: '#3498DB',
      distance: 50,
      position: options.position
    })
  }
}

export default {
  Point,
  ClosePoint,
  MidPoint,
  RemotePoint
}
