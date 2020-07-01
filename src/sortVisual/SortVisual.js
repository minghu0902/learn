
const BAR_STATE = {
  NORMAL: 0,
  SELECTED: 1
}

const SORT_TYPE = {
  BUBBLE: 0,
  SELECTION: 1,
  QUICK: 2
}

function sleep(n) {
  return new Promise(resolve => {
    let timer = setTimeout(() => {
      clearTimeout(timer)
      resolve()
    }, n)
  })
}

export class SortVisual {

  constructor(data, sortType) {
    this.data = data || []
    this.sortType = parseInt(sortType, 10) || SORT_TYPE.BUBBLE

    this.drawCanvas()
    this.initData()
    this.render()
    this.sort()
  }

  initData() {
    const width = this._canvas.width
    const height = this._canvas.height
    const itemWidth = parseInt(width / this.data.length, 10)

    this.data = this.data.map((item, i) => {
      const x = i * itemWidth
      const y = height * (1 - this.data[i] / 100)

      return {
        value: item,
        coord: { x: 0, y: 0 },
        curCoord: { x, y },
        state: BAR_STATE.NORMAL
      }
    })
  }

  drawCanvas() {
    const canvas = document.createElement('canvas')
    const width = 400
    const height = 500

    canvas.width = width
    canvas.height = height
    canvas.style.cssText = 'display: block; margin: 0 auto;'
    document.body.appendChild(canvas)
    
    this._canvas = canvas
  }

  render() {
    const ctx = this._canvas.getContext('2d')
    const width = this._canvas.width
    const height = this._canvas.height
    const dis = 20
    const barWidth = 30

    ctx.clearRect(0, 0, width, height)

    for (let i = 0; i < this.data.length; i++) {
      const item = this.data[i]
      ctx.save()
      if (item.state === BAR_STATE.SELECTED) {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, .5)'
      }
      ctx.fillRect(item.curCoord.x, item.curCoord.y, barWidth, height)
      ctx.restore()
    }
  }

  switchTo(sourceIndex, targetIndex) {
    const source = this.data[sourceIndex]
    const target = this.data[targetIndex]
    const step = 2
    let swapping = false

    return new Promise(resolve => {
      const frame = () => {
 
        if (!swapping) {
          swapping = true
          source.coord = { ...target.curCoord }
        }

        if (source.curCoord.x < source.coord.x) {
          source.curCoord.x += step
        } else if (source.curCoord.x > source.coord.x) {
          source.curCoord.x -= step
        }
        
        if (source.curCoord.x === source.coord.x) {
          resolve()
        } else {
          this.render()
          window.requestAnimationFrame(frame)
        }
      }

      frame()
    })
  }

  async swap(a, b) {
    await Promise.all([
      this.switchTo(a, b),
      this.switchTo(b, a)
    ])
  }

  async toggle(selectedList) {
    const limit = 3
    let count = 0

    const step = async () => {
      count++
      this.toggleState(selectedList)
      this.render()
      await sleep(300)

      if (count <= limit) {
        await step()
      } else {
        this.setState(BAR_STATE.NORMAL, selectedList)
        this.render()
      }
    }

    return step()
  }

  async select(selectedList) {
    this.setState(BAR_STATE.SELECTED, selectedList)
    this.render()
    await sleep(600)
    this.setState(BAR_STATE.NORMAL, selectedList)
    this.render()
  }

  setState(state, selectedList) {
    for (let i = 0; i < selectedList.length; i++) {
      this.data[selectedList[i]].state = state
    }
  }

  toggleState(selectedList) {
    for (let i = 0; i < selectedList.length; i++) {
      const item = this.data[selectedList[i]]
      if (item.state === BAR_STATE.SELECTED) {
        item.state = BAR_STATE.NORMAL
      } else {
        item.state = BAR_STATE.SELECTED
      }
    }
  }

  sort() {
    switch(this.sortType) {
      case SORT_TYPE.SELECTION:
        this.selectionSort()
        break
      case SORT_TYPE.QUICK:
        this.quickSort()
        break
      default:
        this.bubbleSort()
    }
  }

  async bubbleSort() {
    for (let i = 0; i < this.data.length - 2; i++) {
      for (let j = 0; j < this.data.length - 1; j++) {
        if (this.data[j].value > this.data[j + 1].value) {
          await this.toggle([j, j + 1])
          const tmp = this.data[j]
          this.data[j] = this.data[j + 1]
          this.data[j + 1] = tmp
          await this.swap(j, j + 1)
        } else {
          await this.select([j, j + 1])
        }
      }
    }
  }

  async selectionSort() {
    for (let i = 0; i < this.data.length - 1; i++) {
      for (let j = i + 1; j < this.data.length; j++) {
        if (this.data[j].value < this.data[i].value) {
          await this.toggle([i, j])
          const tmp = this.data[i]
          this.data[i] = this.data[j]
          this.data[j] = tmp
          await this.swap(i, j)
        } else {
          await this.select([i, j])
        }
      }
    }
  }

  async quickSort() {
    const step = async (startIndex, endIndex) => {
      if (startIndex >= endIndex) return
      let targetIndex = startIndex
      let target = this.data[targetIndex]
      for (let i = startIndex + 1; i <= endIndex; i++) {
        if (this.data[i].value < target.value) {
          await this.toggle([i, targetIndex])
          this.data.splice(startIndex, 0, this.data.splice(i, 1)[0])
          target = this.data[++targetIndex]

          // 重新绘制
          const swapList = []
          for (let j = startIndex; j < i; j++) {
            swapList.push(this.swap(j, j + 1))
          }
          await Promise.all([
            this.switchTo(i, startIndex),
            ...swapList
          ])
          i--
        } else {
          await this.select([i, targetIndex])
        }
      }
      step(startIndex, targetIndex)
      step(targetIndex + 1, endIndex)
    }
    step(0, this.data.length - 1)
  }
}