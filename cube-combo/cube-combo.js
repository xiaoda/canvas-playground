class CubeCombo {
  constructor (options = {}) {
    this.cubes = options.cubes || Array([0, 0, 0])
  }

  getBoundary () {
    const coordinates = {}
    const boundary = {}
    Array('x', 'y', 'z').forEach((axis, index) => {
      coordinates[axis] = this.cubes.map(cube => cube[index])
    })
    Object.keys(coordinates).forEach(axis => {
      boundary[axis] = [
        Math.min(...coordinates[axis]),
        Math.max(...coordinates[axis])
      ]
    })
    return boundary
  }

  getSize () {
    const {x, y, z} = this.getBoundary()
    return [
      x[1] - x[0],
      y[1] - y[0],
      z[1] - z[0]
    ]
  }

  getMidPoint () {
    const boundary = this.getBoundary()
    return Object.keys(boundary).map(axis => {
      return boundary[axis].reduce((sum, current) => sum + current) * .5
    })
  }

  /* X & Y coordinates */
  getFrontLook () {
    return GeometryUtils.unique(
      this.cubes.map(cube => [cube[0], cube[1]])
    )
  }

  /* Z & Y coordinates */
  getSideLook () {
    return GeometryUtils.unique(
      this.cubes.map(cube => [cube[2], cube[1]])
    )
  }

  /* X & Z coordinates */
  getUpperLook () {
    return GeometryUtils.unique(
      this.cubes.map(cube => [cube[0], cube[2]])
    )
  }
}

export default CubeCombo
