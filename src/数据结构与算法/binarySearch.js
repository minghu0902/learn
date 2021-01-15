
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1, mid
  while(left <= right) {
    mid = (right - left) / 2 + left
    if (arr[mid] === target) return mid
    if (arr[left] === target) return left
    if (arr[right] === target) return right
    if (arr[mid] < target) left = mid + 1
    if (arr[mid] > target) right = mid - 1 
  }
  return -1
}