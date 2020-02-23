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

  changeImageSize (srcImageData, ratio) {
    const inverseRatio = 1 / ratio
    const srcPixelRange = inverseRatio
    const {
      width:  srcWidth,
      height: srcHeight,
      data:   srcData
    } = srcImageData
    const [distWidth, distHeight] =
      [srcWidth, srcHeight].map(size => {
        return Math.floor(size * ratio)
      })
    const distImageData = window.ctx.createImageData(
      distWidth, distHeight
    )
    const {
      data: distData
    } = distImageData

    for (let i = 0; i < distHeight; i++) {
      for (let j = 0; j < distWidth; j++) {
        const distIndex = (i * distWidth + j) * 4
        const [srcRowStart, srcColumnStart] =
          [i, j].map(position => position * inverseRatio)
        const [srcRowEnd, srcColumnEnd] =
          [i, j].map(position => (position + 1) * inverseRatio)

        /* Start to loop row */
        const kStart = Math.floor(srcRowStart)
        const kEnd = srcRowEnd
        for (let k = kStart; k < kEnd; k++) {
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
            const columnRatio = _getRatioOfPixel(
              srcColumnStart,
              srcColumnEnd,
              lStart,
              lEnd,
              l
            )

            /* Combine row & column */
            const srcIndex = (k * srcWidth + l) * 4
            const srcRatio = rowRatio * columnRatio
            distData[distIndex] += srcData[srcIndex] * srcRatio
            distData[distIndex + 1] += srcData[srcIndex + 1] * srcRatio
            distData[distIndex + 2] += srcData[srcIndex + 2] * srcRatio
            distData[distIndex + 3] += srcData[srcIndex + 3] * srcRatio
          }
        }
      }
    }
    this.changeCanvasSize(distWidth, distHeight)
    window.ctx.putImageData(distImageData, 0, 0)

    function _getRatioOfPixel (
      srcStart,
      srcEnd,
      loopStart,
      loopEnd,
      loopCurrent
    ) {
      let ratio
      if (loopEnd <= loopStart + 1) {
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
  },

  setImageSize2xSharp (srcImageData) {
    const {
      width:  srcWidth,
      height: srcHeight,
      data:   srcData
    } = srcImageData
    const [distWidth, distHeight] =
      [srcWidth, srcHeight].map(size => size * 2)
    const distImageData = window.ctx.createImageData(
      distWidth, distHeight
    )
    const {
      data: distData
    } = distImageData

    for (let i = 0; i < distHeight; i++) {
      for (let j = 0; j < distWidth; j++) {
        const distIndex = (i * distWidth + j) * 4
        const isSrcEvenRow = i % 2 === 0
        const isSrcEvenColumn = j % 2 === 0
        let srcIndexes = []
        if (isSrcEvenRow && isSrcEvenColumn) { // position (0, 0)
          const k = i / 2
          const l = j / 2
          const srcIndex = (k * srcWidth + l) * 4
          srcIndexes = [srcIndex]
        } else if (isSrcEvenRow && !isSrcEvenColumn) { // position (0, 1)
          const k = i / 2
          const ls = [
            Math.floor(j / 2),
            Math.ceil(j / 2)
          ]
          srcIndexes = ls.map(l => {
            return (k * srcWidth + l) * 4
          })
        } else if (!isSrcEvenRow && isSrcEvenColumn) { // position (1, 0)
          const ks = [
            Math.floor(i / 2),
            Math.ceil(i / 2)
          ]
          const l = j / 2
          srcIndexes = ks.map(k => {
            return (k * srcWidth + l) * 4
          })
        } else if (!isSrcEvenRow && !isSrcEvenColumn) { // position (1, 1)
          const ks = [
            Math.floor(i / 2),
            Math.ceil(i / 2)
          ]
          const ls = [
            Math.floor(j / 2),
            Math.ceil(j / 2)
          ]
          srcIndexes = ks.map((k, kIndex) => {
            return (k * srcWidth + ls[kIndex]) * 4
          })
        }

        /* Combine pixels */
        const combinePixelsData = _combinePixelsDataWrapper(srcIndexes)
        distData[distIndex] = combinePixelsData()
        distData[distIndex + 1] = combinePixelsData(1)
        distData[distIndex + 2] = combinePixelsData(2)
        distData[distIndex + 3] = combinePixelsData(3)
      }
    }
    this.changeCanvasSize(distWidth, distHeight)
    window.ctx.putImageData(distImageData, 0, 0)

    function _combinePixelsData (srcIndexes, offset = 0) {
      const srcRatio = 1 / srcIndexes.length
      return srcIndexes.map(srcIndex => {
        return srcData[srcIndex + offset] * srcRatio
      }).reduce((accumulator, current) => {
        return accumulator + current
      })
    }

    function _combinePixelsDataWrapper (srcIndexes) {
      return offset => _combinePixelsData(srcIndexes, offset)
    }
  }
}
