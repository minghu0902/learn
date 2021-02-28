const path = require('path')
const Koa = require('koa')
const koaStatic = require('koa-static')
const { parse } = require('es-module-lexer')
const MagicString = require('magic-string')
const { Readable } = require('stream')
const fs = require('fs')
const { resolve } = require('path')
const compilerSFC = require('@vue/compiler-sfc')

const app = new Koa()

// 解析 import 语法并改写
app.use(async (ctx, next) => {
  await next()
  if (ctx.body && ctx.response.is('js')) {
    const content = await readBody(ctx.body)
    const result = rewriteImports(content)
    ctx.body = result
  }
})

// 解析 vue 文件
app.use(async (ctx, next) => {
  await next()
  if (ctx.body && ctx.path.endsWith('.vue')) {
    const content = await streamToString(ctx.body)
    const { descriptor } = compilerSFC.parse(content)
    let code
    if (!ctx.query.type) {
      code = descriptor.script.content
      code = code.replace(/export\s+default\s+/g, 'const __script = ')
      code += `
      import { render as __render } from "${ctx.path}?type=template"
      __script.render = __render
      export default __script
      `
    } else if (ctx.query.type === 'template') {
      const templateRender = compilerSFC.compileTemplate({ source: descriptor.template.content })
      code = templateRender.code
    }
    ctx.type = 'application/javascript'
    ctx.body = stringToStream(code)
  }
})

// 解析以 @modules 开头的文件
app.use(async (ctx, next) => {
  const modulesReg = /^\/@modules\//
  if (!modulesReg.test(ctx.path)) {
    return next()
  }
  
  const id = ctx.path.substring(10)
  const content = await fs.readFileSync(resolveModules(process.cwd(), id), 'utf-8')
  ctx.type = 'js'
  ctx.body = content

  await next()
})

// 设置静态目录
app.use(koaStatic(process.cwd()))
app.use(koaStatic(path.join(process.cwd(), 'public')))

app.listen(8888)






/************工具方法***************** */

function resolveModules(root, name) {
  const packagePath = path.join(root, 'node_modules', name, 'package.json')
  const package = require(packagePath)
  return path.resolve(path.dirname(packagePath), package.module)
}

async function readBody(stream) {
  return stream instanceof Readable ? await streamToString(stream) : stream
}

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    stream.on('error', reject)
  })
}

function stringToStream(text) {
  const stream = new Readable()
  stream.push(text)
  stream.push(null)
  return stream
}

function rewriteImports(source) {
  const imports = parse(source)[0]
  const magicString = new MagicString(source)
  
  if (imports.length) {
    for (let i = 0; i < imports.length; i++) {
      const { s, e } = imports[i]
      const id = source.substring(s, e)
      if (/^[^\/\.]/.test(id)) {
        magicString.overwrite(s, e, `/@modules/${id}`)
      }
    }
  }

  return magicString.toString()
}