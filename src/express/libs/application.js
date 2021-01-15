const http = require('http')
const url = require('url')
const Router = require('./router')

class Application {

  constructor() {
    this.router = new Router()
  }

  get(pathname, ...handlers) {
    handlers.forEach(handler => {
      this.router.get(pathname, handler)
    })
  }

  listen() {
    const server = http.createServer((req, res) => {
      function done() {
        res.end(`Connot ${req.method} ${url.parse(req.url).pathname}`)
      }
      this.router.handle(req, res, done)
    })
    server.listen(...arguments)
  }
}

module.exports = Application