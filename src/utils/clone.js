
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
}

function clone(o) {
    var target;
    if(isObject(o)) {
        target = {};
        for(var key in o) {
            if(o.hasOwnProperty(key)) {
                target[key] = clone(o[key]);
            }
        }
    } else if(isArray(o)) {
        target = [];
        for(var i = 0; i < o.length; i++) {
            target[i] = clone(o[i]);
        }
    } else { 
        return o;
    }
    return target;
}