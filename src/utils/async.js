/** 
 * async函数的实现原理，就是将Generator函数和执行器包装在一个函数中
*/

function spawn(genFn) {
  return new Promise((resolve, reject) => {
    let g = genFn()
    function step(value) {
      try {
        let v = g.next(value)
      } catch(err) {
        reject(err)
      }
      if (v.done) {
        resolve(v.value)
      } else {
        Promise.resolve(v.value).then((value) => {
          step(value)
        }, (err) => {
          g.throw(err)
        })
      }
    }
    step()
  })
}

function* test() {
  const a = yield 1 + 2
  const b = yield a * 3
  return a + b
}
const res = spawn(test)
res.then(value => {
  console.log(value)
})