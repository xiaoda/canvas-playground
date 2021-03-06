import common from './common.js'
import connectPoints from './connect-points.js'
import connectPointsByPixel from './connect-points-by-pixel.js'
import smoothenLastLine from './smoothen-last-line.js'
import straightenLastLine from './straighten-last-line.js'
import makeLastLinePolygon from './make-last-line-polygon.js'

export default {
  ...common,
  connectPoints,
  connectPointsByPixel,
  smoothenLastLine,
  straightenLastLine,
  makeLastLinePolygon
}
