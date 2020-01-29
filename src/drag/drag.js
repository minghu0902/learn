

function Drag (el) {
  this.el = typeof el === 'string' ? document.querySelector(el) : el

  this.isDraging = false

  this.offset = {
    x: 0,
    y: 0
  }

  this.el.addEventListener('mousedown', event => {
    this.isDraging = true
    const bcr = this.el.getBoundingClientRect()
    this.offset.x = event.clientX - bcr.left
    this.offset.y = event.clientY - bcr.top
  }, false )

  document.addEventListener('mouseup', (event) => {
    this.isDraging = false
  }, false)

  document.addEventListener('mousemove', (event) => {
    if (!this.isDraging) {
      return
    }
    const left = event.clientX - this.offset.x
    const top = event.clientY - this.offset.y
    this.el.style.transform = `translate3d(${left}px, ${top}px, 0)`
  })
}