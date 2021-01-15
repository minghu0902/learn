const Layer = require('./layer')

class Route {

  constructor() {
    this.stack = []
  }

  get(handler) {
    const layer = new Layer(null, 'GET', handler)
    this.stack.push(layer)
  }

  dispatch(req, res, out) {
    let i = 0
    const next = () => {
      if (i >= this.stack.length) return out()
      const layer = this.stack[i++]
      if (layer.matchMethod(req.method)) {
        layer.handle(req, res, next)
      } else {
        next()
      }
    }
    next()
  }
}

module.exports = Route