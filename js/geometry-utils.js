const GeometryUtils = {

  /**
   * Common
   */
  includes (array, item) {
    return array.some(arrayItem => {
      return JSON.stringify(arrayItem) === JSON.stringify(item)
    })
  },
  isBetween (limitA, limitB, x) {
    return (x - limitA) * (x - limitB) <= 0
  },
  isBetweenByOdd (limits, x) {
    let smallerCount = 0
    let biggerCount = 0
    limits.forEach(limit => {
      if (x >= limit) smallerCount++
      if (x <= limit) biggerCount++
    })
    return !!smallerCount && !!biggerCount &&
           (smallerCount % 2 === 1 || biggerCount % 2 === 1)
  },
  mix (a, b, ratio) {
    return a * (1 - ratio) + b * ratio
  },
  clamp (min, max, x) {
    return Math.min(Math.max(x, min), max)
  },
  formatRadian (radian) {
    while (Math.abs(radian) > Math.PI) {
      radian += Math.PI * 2 * (radian / Math.abs(radian)) * -1
    }
    return radian
  },

  /**
   * Basic
   */
  getDistanceBetweenPoints (pointA, pointB) {
    return ((pointA[0] - pointB[0]) ** 2 + (pointA[1] - pointB[1]) ** 2) ** .5
  },
  getPointByOffset (point, offset = {}) {
    return [
      point[0] + (offset.x || 0),
      point[1] + (offset.y || 0)
    ]
  },
  getMidPointBetweenPoints (pointA, pointB, ratio = .5) {
    return [
      this.mix(pointA[0], pointB[0], ratio),
      this.mix(pointA[1], pointB[1], ratio)
    ]
  },
  getPointBetweenPointsByX (pointA, pointB, x) {
    if (!this.isBetween(pointA[0], pointB[0], x)) {
      return null
    } else if (pointA[0] == pointB[0]) {
      return null
    } else {
      const ratio = (x - pointA[0]) / (pointB[0] - pointA[0])
      const y = pointA[1] + (pointB[1] - pointA[1]) * ratio
      return [x, y]
    }
  },
  getPointBetweenPointsByY (pointA, pointB, y) {
    if (!this.isBetween(pointA[1], pointB[1], y)) {
      return null
    } else if (pointA[1] == pointB[1]) {
      return null
    } else {
      const ratio = (y - pointA[1]) / (pointB[1] - pointA[1])
      const x = pointA[0] + (pointB[0] - pointA[0]) * ratio
      return [x, y]
    }
  },
  getPointByPointVectorDistance (point, vector, distance) {
    if (distance < 0) vector = [vector[0] * -1, vector[1] * -1]
    const x = (distance ** 2 / (vector[0] ** 2 + vector[1] ** 2)) ** .5
    return [
      point[0] + vector[0] * x,
      point[1] + vector[1] * x
    ]
  },
  getPointByPointRadianDistance (point, radian, distance) {
    radian = this.formatRadian(radian)
    let vector = []
    if (Math.abs(radian) === Math.PI / 2) {
      vector = [0, radian / Math.abs(radian)]
    } else {
      const quadrant = this.getQuadrantFromRadian(radian)
      switch (quadrant) {
        case 0:
        case 3:
          vector[0] = 1
          break
        case 1:
        case 2:
          vector[0] = -1
          break
      }
      vector[1] = vector[0] * Math.tan(radian)
    }
    return this.getPointByPointVectorDistance(point, vector, distance)
  },
  getCurvePointBetweenPoints (pointA, pointB, curvature) {
    const midPoint = this.getMidPointBetweenPoints(pointA, pointB)
    const vector = this.getVector(pointA, pointB)
    const verticalVector = this.getVerticalVector(vector)
    const distance = this.getDistanceBetweenPoints(pointA, pointB)
    const curveDistance = distance * .5 * curvature
    return this.getPointByPointVectorDistance(midPoint, verticalVector, curveDistance)
  },
  getVector (pointA, pointB) {
    return [pointB[0] - pointA[0], pointB[1] - pointA[1]]
  },
  getVerticalVector (vector, clockwise = 1) {
    const quadrant = this.getQuadrant(vector)
    const verticalVector = [Math.abs(vector[1]), Math.abs(vector[0])]
    let verticalVectorQuadrant = quadrant + (clockwise ? -1 : 1)
    switch (verticalVectorQuadrant) {
      case 0: // 1st quadrant
      case 4:
        break
      case 1: // 2nd quadrant
        verticalVector[0] *= -1
        break
      case 2: // 3rd quadrant
        verticalVector[0] *= -1
        verticalVector[1] *= -1
        break
      case -1:
      case 3: // 4th quadrant
        verticalVector[1] *= -1
        break
    }
    return verticalVector
  },
  getQuadrant (pointOrVector) {
    let quadrant
    if (pointOrVector[0] > 0) {
      if (pointOrVector[1] > 0) {
        quadrant = 0 // 1st quadrant
      } else {
        quadrant = 3 // 4th quadrant
      }
    } else {
      if (pointOrVector[1] > 0) {
        quadrant = 1 // 2nd quadrant
      } else {
        quadrant = 2 // 3rd quadrant
      }
    }
    return quadrant
  },
  getQuadrantFromRadian (radian) {
    radian = this.formatRadian(radian)
    let quadrant
    if (radian > 0) {
      if (radian < Math.PI * .5) {
        quadrant = 0 // 1st quadrant
      } else {
        quadrant = 1 // 2nd quadrant
      }
    } else {
      if (radian > Math.PI * .5 * -1) {
        quadrant = 3 // 4th quadrant
      } else {
        quadrant = 2 // 3rd quadrant
      }
    }
    return quadrant
  },
  getRadian (vertex, pointA, pointB) {
    const checkYPositive = vector => {
      let reversed = 0
      if (vector[1] < 0) {
        reversed = 1
        vector = vector.map(x => x * -1)
      }
      return [vector, reversed]
    }
    const [vectorAX, vectorAXReversed] = checkYPositive(
      [pointA[0] - vertex[0], pointA[1] - vertex[1]]
    )
    const radianAX = Math.atan2(vectorAX[1], vectorAX[0]) + Math.PI * vectorAXReversed
    const [vectorBX, vectorBXReversed] = checkYPositive(
      [pointB[0] - vertex[0], pointB[1] - vertex[1]]
    )
    const radianBX = Math.atan2(vectorBX[1], vectorBX[0]) + Math.PI * vectorBXReversed
    const radian = this.formatRadian(radianBX - radianAX)
    return radian
  },
  getRadianFromXAxis (point) {
    return this.getRadian([0, 0], [1, 0], point)
  },
  transformPointByRadian (point, radian) {
    const distance = this.getDistanceBetweenPoints(point, [0, 0])
    const pointRadian = this.getRadianFromXAxis(point)
    const distRadian = this.formatRadian(pointRadian + radian)
    const distPoint = []
    distPoint[0] = (distance ** 2 / (1 + Math.tan(distRadian) ** 2)) ** .5
    if (distRadian > Math.PI * .5 || distRadian < Math.PI * .5 * -1) {
      distPoint[0] *= -1
    }
    distPoint[1] =
      Math.abs(distRadian) === Math.PI * .5 ?
      distance * (distRadian / Math.abs(distRadian)) :
      distPoint[0] * Math.tan(distRadian)
    return distPoint
  },

  /**
   * Judge point being in polygon (By intersection)
   */
  isPointInPolygonByIntersection (vertices, point) {
    const horizontalPointsX = []
    const verticalPointsY = []
    for (let i = 0; i < vertices.length; i++) {
      const thisVertex = vertices[i]
      const nextVertex = i === vertices.length - 1 ? vertices[0] : vertices[i + 1]
      const horizontalPoint = this.getPointBetweenPointsByY(thisVertex, nextVertex, point[1])
      if (horizontalPoint) horizontalPointsX.push(horizontalPoint[0])
      const verticalPoint = this.getPointBetweenPointsByX(thisVertex, nextVertex, point[0])
      if (verticalPoint) verticalPointsY.push(verticalPoint[1])
    }
    return this.isBetweenByOdd(horizontalPointsX, point[0]) &&
           this.isBetweenByOdd(verticalPointsY, point[1])
  },

  /**
   * Judge point being in polygon (By radian)
   */
  isPointInPolygonByRadian (vertices, point) {
    if (this.includes(vertices, point)) return true
    let totalRadian = 0
    for (let i = 0; i < vertices.length; i++) {
      const thisVertex = vertices[i]
      const nextVertex = i === vertices.length - 1 ? vertices[0] : vertices[i + 1]
      totalRadian += this.getRadian(point, thisVertex, nextVertex)
    }
    return Math.abs(totalRadian) > Math.PI * 2 - 1 &&
           Math.abs(totalRadian) < Math.PI * 2 + 1
  },

  /**
   * Get distance whether a point is in polygon or not
   */
  getPointDistanceFromPolygon (vertices, point) {
    const distances = []
    for (let i = 0; i < vertices.length; i++) {
      const thisVertex = vertices[i]
      const nextVertex = i === vertices.length - 1 ? vertices[0] : vertices[i + 1]
      const translatedNextVertex = this.getVector(thisVertex, nextVertex)
      const translatedPoint = this.getVector(thisVertex, point)
      const transformedNextVertex = [
        this.getDistanceBetweenPoints(translatedNextVertex, [0, 0]), 0
      ]
      const radian = this.getRadian([0, 0], translatedNextVertex, transformedNextVertex)
      const transformedPoint = this.transformPointByRadian(translatedPoint, radian)
      let distance
      if (this.isBetween(
        0, transformedNextVertex[0], transformedPoint[0]
      )) {
        distance = Math.abs(transformedPoint[1])
      } else {
        distance = Math.min(
          this.getDistanceBetweenPoints(transformedPoint, [0, 0]),
          this.getDistanceBetweenPoints(transformedPoint, transformedNextVertex)
        )
      }
      distances.push(distance)
    }
    return Math.min(...distances)
  },

  /**
   * Judge point being in circle
   */
  isPointInCircle (center, radius, point) {
    const distance = this.getDistanceBetweenPoints(center, point)
    return distance <= radius
  },

  /**
   * Get distance whether a point is in circle or not
   */
  getPointDistanceFromCircle (center, radius, point) {
    const distance = this.getDistanceBetweenPoints(center, point)
    return Math.abs(distance - radius)
  }
}

try {
  module.exports = GeometryUtils
} catch (e) {}
