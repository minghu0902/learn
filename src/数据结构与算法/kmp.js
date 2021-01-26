
function kmp(source, pattern) {
  // 回退表
  const table = Array(source.length).fill(0)

  // 计算回退表
  let i = 1, j = 0
  while(i < pattern.length) {
    if (pattern[i] === pattern[j]) {
      i++
      j++
      table[i] = j // 表示如果 i 位置没匹配上，可跳转至 j 位置上继续匹配
    } else {
      if (j > 0) {
        j = table[j]
      } else {
        i++
      }
    }
  }

  // 匹配
  let m = 0, n = 0
  while(m < source.length) {
    if (source[m] === pattern[n]) {
      m++
      n++
    } else {
      if (n > 0) {
        n = table[n]
      } else {
        m++
      }
    }
    // 判断是否已经匹配完成
    if (n === pattern.length) {
      return m - n
    }
  }

  return -1
}