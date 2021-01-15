function quickSort(arr, left, right) {
  if (arr.length <= 1) return arr
  if (left < right) {
    const center = quickSortHelper(arr, left, right)
    quickSort(arr, left, center - 1)
    quickSort(arr, center + 1, right)
  }
}

function quickSortHelper(arr, left, right) {
  let center = left
  let index = left + 1
  for (let i = index; i <= right; i++) {
    if (arr[i] < arr[index]) {
      [arr[i], arr[index]] = [arr[index], arr[i]]
      index++
    }
  }
  [arr[index - 1], arr[center]] = [arr[center], arr[index - 1]]
  return index - 1
}