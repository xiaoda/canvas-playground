import Manipulate from './manipulate.js'

window.canvas = document.getElementById('canvas')
window.ctx = canvas.getContext('2d')

const appData = {
  fileName: null,
  initialImageData: null
}

function setAppData (dataObject) {
  Object.keys(dataObject).forEach(key => {
    appData[key] = dataObject[key]
  })
}

const $upload = new Component({
  elementId: 'upload',
  render () {
    return `
      <input
        type="file"
        accept="image/*"
        onChange="${this.instance}.uploadImage(event)"
      >
    `
  },
  methods: {
    uploadImage (event) {
      const [file] = event.target.files
      setAppData({
        fileName: file.name
      })
      const image = new Image()
      image.onload =  _ => {
        setAppData({
          initialImageData: Manipulate.getImageData()
        })
        $sizeControl.setData({
          currentSize: 100
        })
        Manipulate.changeCanvasSize(image.width, image.height)
        ctx.drawImage(image, 0, 0)
      }
      image.src = URL.createObjectURL(file)
    }
  }
})

const $sizeControl = new Component({
  elementId: 'sizeControl',
  data () {
    const currentSize = 100
    const minSize = 5
    const maxSize = 200
    const sizeStep = 5
    const sizeMarks = []
    for (let i = minSize; i <= maxSize; i += sizeStep) {
      sizeMarks.push(i)
    }
    return {
      currentSize,
      minSize,
      maxSize,
      sizeStep,
      sizeMarks
    }
  },
  render () {
    const {
      currentSize,
      minSize,
      maxSize,
      sizeStep,
      sizeMarks
    } = this.data
    return `
      <div class="block-title">Size</div>
      <div>${currentSize}%</div>
      <div>
        <input
          type="range"
          value="${currentSize}"
          min="${minSize}"
          max="${maxSize}"
          step="${sizeStep}"
          list="sizeMarks"
          onChange="${this.instance}.handleCurrentSizeInput(event)"
          style="width: 500px;"
        >
        <datalist id="sizeMarks">` + sizeMarks.map(size => `
          <option value="${size}" label="${size}"></option>
        `).join('') + `</datalist>
      </div>
      <div>` + [5, 50, 100, 150, 200].map(size => `
        <button
          onClick="${this.instance}.changeCurrentSize(${size})"
        >${size}%</button>
      `).join('') + `</div>
    `
  },
  methods: {
    handleCurrentSizeInput (event) {
      const newSize = Number(event.target.value)
      this.changeCurrentSize(newSize)
    },
    changeCurrentSize (newSize) {
      const {
        fileName, initialImageData
      } = appData
      const {
        currentSize,
        minSize,
        maxSize,
        sizeStep
      } = this.data
      if (
        newSize > maxSize ||
        newSize < minSize ||
        newSize % sizeStep !== 0
      ) {
        this.update()
      } else {
        this.setData({
          currentSize: newSize
        })
        if (!fileName) return
        const ratio = newSize / currentSize
        Manipulate.changeImageSize(initialImageData, ratio)
      }
    }
  }
})
