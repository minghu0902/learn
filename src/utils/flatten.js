
// 如果数组内都是是基本类型
function flatten(arr=[]) {
    return arr.toString().split(',');
}

function flatten(arr=[]) {
    return arr.reduce((prev, current) => {
        return [].concat(
            Array.isArray(prev) ? flatten(prev) : prev,
            Array.isArray(current) ? flatten(current) : current
        )
    })
}

// 指定层数
function flatten(arr=[], n=1) {
    return n > 0 ? arr.reduce((prev, current) => prev.concat(Array.isArray(current) ? flatten(current, --n) : current), [])
                 : arr.slice()
}

function flatten(arr=[]) {
    const result = []
    for(let item of arr) {
        if(Array.isArray(item)) {
            flatten(item, result);
        } else {
            result.push(item);
        }
    }
    return result;
}

function flatten(arr=[]) {
    const flattened = [];
    (function flat(arr) {
        arr.forEach(item => {
            Array.isArray(item) ? flat(item) : flattened.push(item)
        })
    })(arr);
    return flattened
}

function* flatten(arr=[]) {
    for (let item of arr) {
        if (Array.isArray(item)) {
            yield* flatten(item)
        } else {
            yield item
        }
    }
}

function flatten(arr=[]) {
    return arr.flat(Infinity)
}

