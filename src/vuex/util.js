
function forEachValue(obj, fn) {
    Object.keys(obj).forEach(key => fn(obj[key], key))
}

function isPromise (val) {
    return val && typeof val.then === 'function'
}