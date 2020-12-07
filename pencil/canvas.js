import common from './core/common.js'
import connectPoints from './core/connect-points.js'
import connectPointsByPixel from './core/connect-points-by-pixel.js'
import smoothenLastLine from './core/smooth-last-line.js'
import straightenLastLine from './core/straighten-last-line.js'

export default {
  ...common,
  connectPoints,
  connectPointsByPixel,
  smoothenLastLine,
  straightenLastLine
}
