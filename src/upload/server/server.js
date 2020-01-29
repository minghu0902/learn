const path = require('path')
const fs = require('fs')
const Koa = require('koa')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const Router = require('koa-router')


const app = new Koa()
const router = new Router()

app.use(koaStatic(path.resolve(__dirname, './public')))

app.use(koaBody({
  formidable: {
    uploadDir: path.resolve(__dirname, './public/upload/')
  },
  multipart: true
}))

app.use((ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Headers', "*")
  ctx.set('Access-Control-Allow-Methods', '*')
  
  if (ctx.method === 'OPTIONS') {
    ctx.body = 'ok'
  } else {
    next()
  }
})

/** 
 * 文件上传
*/
router.post('/upload', (ctx) => {
  const body = ctx.request.body
  let files = ctx.request.files.file

  // 容错，单文件上传不是数组
  if (!Array.isArray(files)) {
    files = [files]
  }

  // 合并切片文件
  if (body.type === 'merge') {
    const writeStream = fs.createWriteStream(
      path.resolve(__dirname, './public/upload/', body.name)
    )

    let index_start = 0
    let index_end = body.total - 1

    mergeFile()
    ctx.body = 'ok'
    
    function mergeFile () {
      if (index_start <= index_end) {
        const filePath = path.resolve(__dirname, './public/upload/', body.token + '-' + index_start)
        const readStream = fs.createReadStream(filePath)
  
        readStream.pipe(writeStream, { end: false })
        readStream.on('end', () => {
          // 删除切片文件
          fs.unlink(filePath, (err) => {
            if (err) {
              throw err
            }
          })
          index_start++
          mergeFile()
        })
      }
    }
  } else if (body.type === 'blob') {
    // 切片文件重命名
    for (const file of files) {
      if (file && file.size > 0) {
        const filePath = file.path.slice(0, file.path.lastIndexOf(path.sep) + 1) + body.token + '-' + body.index
        fs.renameSync(file.path, filePath)
      }
    }
    ctx.body = 'ok'
  } else {
    // 普通文件重命名
    for (const file of files) {
      if (file && file.size > 0) {
        fs.renameSync(file.path, file.path.slice(0, file.path.lastIndexOf(path.sep) + 1) + file.name)
      }
    }
    ctx.body = 'ok'
  }
})

app.use(router.routes())
app.listen(8888, '0.0.0.0')