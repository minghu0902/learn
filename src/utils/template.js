

function template(str='') {
  const escapes = {
    '\'': '\\\'',
    '\n': '\\n',
    '\r': '\\r',
    '\\': '\\\\',
    '\u0020': '', // 空格
    '\u2028': '\\u2028', // 行分隔符
    '\u2029': '\\u2029', // 段落分隔符
  }
  
  const escapes_reg = /\\|'|\n|\r|\u0020|\u2028|\u2029/g
  
  const settings = {
    expression: /<%([\s\S]+?)%>/g,
    evaluation: /<%=([\s\S]+?)%>/g 
  }

  const macher = new RegExp(`${ settings.evaluation.source }|${ settings.expression.source }|$`, 'g')

  let source = "code +='"
  let index = 0

  str.replace(macher, function (match, evaluation, expression, offset) {
    source += str.slice(index, offset).replace(escapes_reg, function (match) {
      return escapes[match]
    })

    index = offset + match.length

    if (expression) {
      source += "';\n" + expression + "\n code +='"
    } else if (evaluation) {
      source += "'+" + evaluation + "+'"
    } else {
      source += "';\n"
    }
  })

  source = "with(context || {}) {\n"+ source +"\n}"

  return new Function('context', `let code = '';${ source };return code`)
}


// test
const tmp = `
  <ul>
    <% for(let i = 0; i < data.length; i++) { %>
      <li><%= data[i] %></li>
    <% } %>
  </ul>
`

const html = template(tmp)({ data: [1, 2, 3] })
console.log(html)
