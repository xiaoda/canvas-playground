export default {
  getImageData (
    sx = 0, sy = 0,
    sw = window.canvas.width,
    sh = window.canvas.height
  ) {
    return window.ctx.getImageData(sx, sy, sw, sh)
  },

  changeCanvasSize (width, height) {
    const styleWidth = `${width / window.devicePixelRatio}px`
    const styleHeight = `${height / window.devicePixelRatio}px`
    window.canvas.width = width
    window.canvas.height = height
    window.canvas.style.width = styleWidth
    window.canvas.style.height = styleHeight
  },

  changeImageSize (imageData, size) {
    const {
      width: srcWidth,
      height: srcHeight,
      data: srcData
    } = imageData
    console.log(srcWidth, srcHeight)
  }
}
