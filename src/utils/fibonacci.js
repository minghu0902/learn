

function fibonacci(n) {
  let first = 1
  let second = 2
  let result = []
  for (let i = 0, temp; i < n; i++) {
    result.push(first)
    temp = first
    first = second
    second += temp
  }
  return result
}


function* fibonacci() {
  let first = 1
  let second = 2
  while(true) {
    yield first;
    [first, second] = [second, first + second]
  }
}

// let f = fibonacci()
// let n = 20
// while(n--) {
//   console.log(f.next())
// }