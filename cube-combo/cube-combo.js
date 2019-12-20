class CubeCombo {
  constructor (options = {}) {
    this.cubes = options.cubes || Array([0, 0, 0])
  }

  getSize () {
    const xList = this.cubes.map(cube => cube[0])
    const yList = this.cubes.map(cube => cube[1])
    const zList = this.cubes.map(cube => cube[2])
    return {
      x: [Math.min(...xList), Math.max(...xList)],
      y: [Math.min(...yList), Math.max(...yList)],
      z: [Math.min(...zList), Math.max(...zList)]
    }
  }

  getMidpoint () {
    const size = this.getSize()
    return [
      size.x.reduce((sum, current) => sum + current) * .5,
      size.y.reduce((sum, current) => sum + current) * .5,
      size.z.reduce((sum, current) => sum + current) * .5
    ]
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
