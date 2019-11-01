
if (typeof Object.create !== 'function') {
    Object.create = function (proto, propertiesObject) {
        if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
        } else if (proto === null) {
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
        }
        if (propertiesObject == null) {
            throw new TypeError('Cannot convert undefined or null to object')
        }

        function F() {}
        F.prototype = proto
        let f = new F()
        return Object.defineProperties(f, propertiesObject)
    }
}