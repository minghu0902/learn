
// 如果数组内都是是基本类型
function flatten(arr = []) {
    return arr.toString().split(',');
}

function flatten(arr = []) {
    return arr.reduce((prev, current) => {
        return [].concat(
            Array.isArray(prev) ? flatten(prev) : prev,
            Array.isArray(current) ? flatten(current) : current
        )
    })
}

function flatten(arr = [], result = []) {
    for(let item of arr) {
        if(Array.isArray(item)) {
            flatten(item, result);
        } else {
            result.push(item);
        }
    }
    return result;
}


