
class Layer {

  constructor(pathname, method, handler) {
    this.pathname = pathname
    this.method = method
    this.handler = handler
  }

  matchPath(pathname) {
    return this.pathname === pathname
  }

  matchMethod(method) {
    return this.method === method
  }

  handle(req, res, next) {
    this.handler(req, res, next)
  }
}

module.exports = Layer