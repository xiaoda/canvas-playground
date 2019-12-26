import CubeCombo from './cube-combo.js'

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
    const levelCubes = Array([cubes])
    let count = 0
    while (
      levelCubes[count] &&
      levelCubes[count].length &&
      count < 999
    ) {
      levelCubes[count + 1] = []
      levelCubes[count].forEach(currentLevelCubes => {
        for (let i = 0; i < currentLevelCubes.length; i++) {
          const cubes = GeometryUtils.clone(currentLevelCubes)
          cubes.splice(i, 1)
          const cubeCombo = new CubeCombo({cubes})
          if (
            CubeCombo.isFaceLooksIdnetical(
              cubeCombo.getFrontLook(),
              this.faceLooks.front
            ) &&
            CubeCombo.isFaceLooksIdnetical(
              cubeCombo.getSideLook(),
              this.faceLooks.side
            ) &&
            CubeCombo.isFaceLooksIdnetical(
              cubeCombo.getUpperLook(),
              this.faceLooks.upper
            ) &&
            !GeometryUtils.includes(
              levelCubes[count + 1],
              cubes
            )
          ) {
            levelCubes[count + 1].push(cubes)
          }
        }
      })
      if (!levelCubes[count + 1].length) {
        delete levelCubes[count + 1]
      }
      count++
    }
    return levelCubes.flat()
  }

  clear () {
    this._init()
  }
}

export default CubeDetector
