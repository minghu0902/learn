const url = require('url')
const Layer = require('./layer')
const Route = require('./route')

class Router {

  constructor() {
    this.stack = []
  }

  route(pathname) {
    const route = new Route()
    const layer = new Layer(pathname, null, route.dispatch.bind(route))
    this.stack.push(layer)
    return route
  }

  get(pathname, handler) {
    const route = this.route(pathname)
    route.get(handler)
  }

  handle(req, res, out) {
    let i = 0
    const next = () => {
      if (i >= this.stack.length) return out()
      const layer = this.stack[i++]
      if (layer.matchPath(url.parse(req.url).pathname)) {
        layer.handle(req, res, next)
      } else {
        next()
      }
    }
    next()
  }
}

module.exports = Router