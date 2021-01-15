const express = require('./libs/express')

const app = express()

app.get('/', function (req, res, next) {
  console.log(1)
  next()
}, function (req, res, next) {
  console.log(11)
  next()
}, function (req, res, next) {
  console.log(1111)
  res.end('ok')
})

app.get('/a', function (req, res, next) {
  console.log(2)
  res.end('ok')
})

app.listen(9090, () => {
  console.log('server started')
})