
// 如果数组内都是是基本类型
function flattern(arr = []) {
    return arr.toString().split(',');
}

function flattern(arr = []) {
    return arr.reduce((prev, current) => {
        return [].concat(
            Array.isArray(prev) ? flattern(prev) : prev,
            Array.isArray(current) ? flattern(current) : current
        )
    })
}


