export default {
  getImageData (
    sx = 0, sy = 0,
    sw = window.canvas.width,
    sh = window.canvas.height
  ) {
    return window.ctx.getImageData(sx, sy, sw, sh)
  },

  changeCanvasSize (width, height) {
    window.canvas.width = width
    window.canvas.height = height
    window.canvas.style.width = `${width / window.devicePixelRatio}px`
    window.canvas.style.height = `${height / window.devicePixelRatio}px`
  },

  changeImageSize (imageData, ratio) {
    const {
      width:  srcWidth,
      height: srcHeight,
      data:   srcData
    } = imageData
    const inverseRatio = 1 / ratio
    const srcPixelRange = inverseRatio
    const [distWidth, distHeight] =
      [srcWidth, srcHeight].map(size => {
        return Math.floor(size * ratio)
      })
    const distImageData = ctx.createImageData(
      distWidth, distHeight
    )

    for (let i = 0; i < distHeight; i++) {
      for (let j = 0; j < distWidth; j++) {
        const distIndex = (i * distWidth + j) * 4
        const srcRowStart = i * inverseRatio
        const srcRowEnd = (i + 1) * inverseRatio
        const srcColumnStart = j * inverseRatio
        const srcColumnEnd = (j + 1) * inverseRatio

        /* Start to loop row */
        const kStart = Math.floor(srcRowStart)
        const kEnd = srcRowEnd
        for (let k = kStart; k < kEnd; k++) {
          const rowIndex = k
          const rowRatio = _getRatioOfPixel(
            srcRowStart,
            srcRowEnd,
            kStart,
            kEnd,
            k
          )

          /* Start to loop column */
          const lStart = Math.floor(srcColumnStart)
          const lEnd = srcColumnEnd
          for (let l = lStart; l < lEnd; l++) {
            const columnIndex = l
            const columnRatio = _getRatioOfPixel(
              srcRowStart,
              srcRowEnd,
              kStart,
              kEnd,
              k
            )

            /* Combine row & column */
            const srcIndex = (k * srcWidth + l) * 4
          }
        }
      }
    }

    function _getRatioOfPixel (
      srcStart,
      srcEnd,
      loopStart,
      loopEnd,
      loopCurrent
    ) {
      let ratio
      if (loopEnd <= loopCurrent + 1) {
        ratio = 1
      } else if (loopCurrent <= srcStart) {
        ratio = (loopCurrent + 1 - srcStart) / srcPixelRange
      } else if (loopCurrent > srcStart && (loopCurrent + 1) <= loopEnd) {
        ratio = 1 / srcPixelRange
      } else if ((loopCurrent + 1) > loopEnd) {
        ratio = (loopEnd - loopCurrent) / srcPixelRange
      }
      return ratio
    }
  }
}
