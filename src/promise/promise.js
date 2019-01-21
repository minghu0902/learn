(function(root) {

    var PENDDING = 'pendding';
    var FULFILLED = 'fulfilled';
    var REJECTED = 'rejected';

    function Promise(fn) {
        var self = this;
        this.state = PENDDING;
        this.value = undefined;
        this.reason = undefined;
        this.onFulfiledCallbacks = [];
        this.onRejectedCallbacks = [];

        function resolve(value) {
            setTimeout(function() {
                if(self.state === PENDDING) {
                    self.state = FULFILLED;
                    self.value = value;
                    self.onFulfiledCallbacks.forEach(cb => {
                        cb(self.value);
                    });
                }
            })
        }

        function reject(reason) {
            setTimeout(function() {
                if(self.state === PENDDING) {
                    self.state = REJECTED;
                    self.reason = reason;
                    self.onRejectedCallbacks.forEach(cb => {
                        cb(self.reason);
                    })
                }
            })
        }

        try {
            fn(resolve, reject);
        } catch(e) {
            reject(e);
        }
    }

    Promise.prototype = {
        constructor: Promise,

        then: function(resolve, reject) {
            if(typeof resolve === 'function') {
                this.onFulfiledCallbacks.push(resolve);
            }
            if(typeof reject === 'function') {
                this.onRejectedCallbacks.push(reject);
            }
            return this;
        }
    }

    root.Promise = Promise;

})(this)