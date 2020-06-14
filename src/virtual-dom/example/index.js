import { h, patch } from '../src/index'


const changeBtn = document.getElementById('changeBtn')
let vnode = patch(null, createVnode(1, 10))
let oldVnode


function createVnode(start, end) {
  let list = []
  for (; start <= end; start++) {
    list.push(
      h('li', {}, [], start)
    )
  }
  return h('div', {}, list)
}

function render(vnode) {
  oldVnode = patch(oldVnode, vnode)
}

changeBtn.onclick = function () {
  const start = parseInt(Math.random() * 5)
  const end = parseInt(Math.random() * (10 - start)) + start
  const vnode = createVnode(start, end)
  console.log(vnode)
  render(vnode)
}

render(vnode)
document.body.appendChild(vnode.elm)