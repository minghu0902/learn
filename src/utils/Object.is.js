
if (typeof Object.is !== 'function') {
    Object.is = function (x, y) {
        if (x === y) {
            // +0 === -0
            return x !== 0 || 1 / x === 1 / y
        } else {
            // NaN
            return x !== x && y !== y
        }
    }
}