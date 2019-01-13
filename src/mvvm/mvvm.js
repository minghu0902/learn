
function MVVM(options) {
    this.$options = options || {};
    this._data = options.data || {};
    Object.keys(this._data).forEach(key => {
        this._proxyData(key);
    });
    observe(this._data);
    if(options.el) {
        new Compile(options.el, this);
    }
}

MVVM.prototype = {
    constructor: MVVM,

    _proxyData: function(key) {
        const self = this;
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                return self._data[key];
            },
            set: function(newVal) {
                self._data[key] = newVal;
            }
        });
    }
}