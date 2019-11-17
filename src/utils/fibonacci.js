

function fibonacci_1(n) {
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


function fibonacci_2(n, first=1, second=2) {
  if (n <= 1) {
    return second
  }
  console.log(first)
  return fibonacci_2(n-1, second, first + second)
}


function* fibonacci_3() {
  let first = 1
  let second = 2
  while(true) {
    yield first;
    [first, second] = [second, first + second]
  }
}

// let f = fibonacci_3()
// let n = 20
// while(n--) {
//   console.log(f.next())
// }