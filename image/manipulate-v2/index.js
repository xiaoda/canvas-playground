const canvas = $('#canvas').get(0)
const ctx = canvas.getContext('2d')

Component.create({
  selector: '#upload',
  data: {
    fileName: null
  },
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
      const {name: fileName} = file
      this.setData({fileName}, false)
      const image = new Image()
      image.onload = function () {
        // todo
      }
      image.src = URL.createObjectURL(file)
    }
  }
})

Component.create({
  selector: '#sizeControl',
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
      <div>
        ${currentSize}%
      </div>
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
        minSize, maxSize, sizeStep
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
      }
    }
  }
})
