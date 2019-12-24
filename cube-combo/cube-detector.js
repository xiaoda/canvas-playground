class CubeDetector {
  constructor () {
    this._init()
  }

  _init () {
    this.faceLooks = {
      front: [], // X & Y coordinates
      side: [],  // Z & Y coordinates
      upper: []  // X & Z coordinates
    }
  }

  setFaceLook (direction, cubes) {
    this.faceLooks[direction] = cubes
  }

  guess () {
    console.log(this.faceLooks)
    const {front, side, upper} = this.faceLooks
    const cubes = []
    front.forEach(cube => {
      const [x1, y1] = cube
      side.forEach(cube => {
        const [z2, y2] = cube
        if (y1 !== y2) return
        upper.forEach(cube => {
          const [x3, z3] = cube
          if (x1 !== x3 || z2 !== z3) return
          cubes.push([x1, y2, z3])
        })
      })
    })
    console.log(cubes)
    return cubes
  }

  clear () {
    this._init()
  }
}

export default CubeDetector
