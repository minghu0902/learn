
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
}

function extend() {
    var target = arguments[0], src, copy;
    if(typeof target !== 'object' && typeof target !== 'function') {
        target = {};
    }
    for(var i = 0; i < arguments.length; i++) {
        var item = arguments[i];
        if(target === item) {
            continue;
        }
        if(item) {
            for(var key in item) {
                src = target[key];
                copy = item[key];
                if(isObject(copy)) {
                    target[key] = extend(isObject(src) ? src : {}, copy);
                } else if(isArray(copy)) {
                    target[key] = extend(isArray(src) ? src : [], copy);
                } else if(typeof copy !== 'undefined') {
                    target[key] = copy;
                } 
            }
        }
    }
    return target;
}