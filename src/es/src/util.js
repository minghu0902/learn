export function isUndef(v) {
    return v === null || v === undefined;
}
export function isDef(v) {
    return v !== null && v !== undefined;
}
export function isTrue(v) {
    return v === true;
}
export function isFalse(v) {
    return v === false;
}
const toString = Object.prototype.toString;
export function isObject(v) {
    return v !== null && typeof v === 'object';
}
export function isPlainObject(v) {
    return toString.call(v) === '[object Object]';
}
export function isArray(v) {
    return toString.call(v) === '[object Array]';
}
export function isPrimitive(v) {
    return (typeof v === 'string' ||
        typeof v === 'number' ||
        typeof v === 'boolean' ||
        typeof v === 'symbol');
}
export function isEquality(a, b) {
    if (typeof a !== typeof b) {
        return false;
    }
    if (isPrimitive(a)) {
        return a === b;
    }
    if (isPlainObject(a)) {
        if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
        }
        for (const [key, value] of Object.entries(a)) {
            if (isPrimitive(value)) {
                if (value !== b[key]) {
                    return false;
                }
            }
            else {
                if (!isEquality(value, b[key])) {
                    return false;
                }
            }
        }
    }
    if (isArray(a)) {
        if (a.length !== b.length) {
            return false;
        }
        let value;
        for (let i = 0; i < a.length; i++) {
            value = a[i];
            if (isPrimitive(value)) {
                if (value !== b[i]) {
                    return false;
                }
            }
            else {
                if (!isEquality(value, b[i])) {
                    return false;
                }
            }
        }
    }
    return true;
}
