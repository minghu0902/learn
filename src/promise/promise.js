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
            if(value instanceof Promise) {
                return value.then(resolve, reject);
            }
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

    function resolvePromise(promise2, x, resolve, reject) {
        if(promise2 === x) {
            return reject(new TypeError('循环引用'));
        }
        if(x instanceof Promise) {
            if(x.state === PENDDING) {
                x.then(value => {
                    resolvePromise(value);
                }, reason => {
                    reject(reason);
                })
            } else {
                x.then(resolve, reject);
            }
        } else if(x !== null && (typeof x === 'object' || typeof x === 'function')) {
            try {
                let then = x.then;
                if(typeof then === 'function') {
                    then.call(x, value => {
                        resolvePromise(promise2, value, resolve, reject);
                    }, reason => {
                        reject(reason);
                    })
                } else {
                    resolve(x);
                }
            } catch(e) {
                reject(e);
            }
        } else {
            resolve(x);
        }
    }

    Promise.prototype = {
        constructor: Promise,

        then: function(onFulfilled, onRejected) {
            onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
            onRejected = typeof onRejected === 'function' ? onRejected : reason => reason;
            let x;
            let newPromise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    if(this.state === FULFILLED) {
                        try {
                            x = onFulfilled(this.value);
                            resolvePromise(newPromise, x, resolve, reject);
                        } catch(e) {
                            reject(e);
                        }
                    } else if(this.state === REJECTED) {
                        try {
                            x = onRejected(this.reason);
                            resolvePromise(newPromise, x, resolve, reject);
                        } catch(e) {
                            reject(e);
                        }
                    } else if(this.state === PENDDING) {
                        this.onFulfiledCallbacks.push(value => {
                            try {
                                x = onFulfilled(value);
                                resolvePromise(newPromise, x, resolve, reject);
                            } catch(e) {
                                reject(e);
                            }
                        });
                        this.onRejectedCallbacks.push(reason => {
                            try {
                                x = onRejected(reason);
                                resolvePromise(newPromise, x, resolve, reject);
                            } catch(e) {
                                reject(e);
                            }
                        })
                    }
                })
            })

            return newPromise;
        }
    }

    root.Promise = Promise;

})(this)