/** 
 * 尾递归优化
*/
function cto(func) {
  let active = false // 标记栈的激活状态
  let args = []
  let value
  
  return function () {
    args.push(arguments)
    if (!active) {
      while(args.length) {
        active = true
        value = func.apply(this, args.shift())
        active = false
      }
      return value
    }
  }
}

const sum = cto(function (n, total=0) {
  if (n <= 1) {
    return total + 1
  }
  return sum(n-1, total+n)
})

console.log(sum(100000)) // 如果不用尾递归优化，会栈溢出