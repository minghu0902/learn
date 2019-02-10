(function(root) {

    var PENDING = 'pending';
    var FULFILLED = 'fulfilled';
    var REJECTED = 'rejected';

    function Promise(fn) {
        var self = this;
        this.state = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onFulfiledCallbacks = [];
        this.onRejectedCallbacks = [];

        // resolve 和 reject 的执行必须是异步，为了保证 onFulfiledCallbacks 和 onRejectedCallbacks 能收集到后面 then 函数中的所有回调 
        function resolve(value) {
            if(value instanceof Promise) {
                return value.then(resolve, reject);
            }

            setTimeout(() => {
                if(self.state === PENDING) {
                    self.state = FULFILLED;
                    self.value = value;
                    self.onFulfiledCallbacks.forEach(cb => {
                        cb(self.value);
                    })
                }
            })
        }

        function reject(reason) {
            setTimeout(() => {
                if(self.state === PENDING) {
                    self.state = REJECTED;
                    self.reason = reason;
                    self.onRejectedCallbacks.forEach(cb => {
                        cb(self.reason);
                    })
                }
            })
        }

        if(typeof fn === 'function') {
            try {
                fn(resolve, reject);
            } catch(e) {
                reject(e);
            }
        }
    }

    function resolvePromise(promise2, x, resolve, reject) {
        let called;
        if(promise2 === x) {
            return new TypeError('循环引用');
        }
        if(x instanceof Error) {
            reject(x);
        }
        if(x instanceof Promise) {
            if(x.state === PENDING) {
                x.then(value => {
                    resolve(value);
                }, reason => {
                    reject(reason);
                })
            } else {
                x.then(resolve, reject);
            }
        } else if(x !== null && (typeof x === 'function' || typeof x === 'object')) {
            try {
                var then = x.then;
                if(typeof then === 'function') {
                    then.call(x, y => {
                        if(called) return;
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    }, r => {
                        if(called) return;
                        called = true;
                        reject(r);
                    });
                } else {
                    resolve(x);
                }
            } catch(e) {
                if(called) return;
                called = true;
                reject(e);
            }
        } else {
            resolve(x);
        }
    }

    Promise.prototype = {
        constructor: Promise,

        then: function(onFulfiled, onRejected) {
            // 保证 onFulfiled onRejected 必须为函数
            onFulfiled = typeof onFulfiled === 'function' ? onFulfiled : value => value;
            onRejected = typeof onRejected === 'function' ? onRejected : reason => reason;

            // then 函数最终返回一个 promise
            var newPromise = new Promise((resolve, reject) => {
                if(this.state === PENDING) {
                    this.onFulfiledCallbacks.push(value => {
                        try {
                            var x = onFulfiled(value);
                            resolvePromise(newPromise, x, resolve, reject);
                        } catch(e) {
                            reject(e);
                        }
                    });
                    this.onRejectedCallbacks.push(reson => {
                        try {
                            var x = onRejected(reson);
                            resolvePromise(newPromise, x, resolve, reject);
                        } catch(e) {
                            reject(e);
                        }
                    });
                } else if(this.state === FULFILLED) {
                    // 为了保证 then 函数异步执行
                    setTimeout(() => {
                        try {
                            var x = onFulfiled(this.value);
                            resolvePromise(newPromise, x, resolve, reject);
                        } catch(e) {
                            reject(e);
                        }
                    })
                } else if(this.state === REJECTED) {
                    setTimeout(() => {
                        try {
                            var x = onRejected(this.reason);
                            resolvePromise(newPromise, x, resolve, reject);
                        } catch(e) {
                            reject(e);
                        }
                    })
                }
            })

            return newPromise;
        },
        catch: function(onRejected) {
            return this.then(null, onRejected);
        }
    }

    Promise.resolve = function(value) {
        return new Promise(resolve => {
            resolve(value);
        });
    }

    Promise.reject = function(reason) {
        return new Promise((resolve, reject) => {
            reject(reason);
        })
    }

    Promise.all = function(promises) {
        if(!Array.isArray(promises)) {
            return new TypeError('参数必须是数组');
        }
        return new Promise((resolve, reject) => {
            try {
                var arr = [];
                var count = 0;
                for(let i=0; i<promises.length; i++) {
                    promises[i].then(value => {
                        arr[i] = value;
                        if(++count === promises.length) {
                            resolve(arr);
                        }
                    }, reason => {
                        reject(reason);
                    })
                }
            } catch(e) {
                reject(e);   
            }
        })
    }

    Promise.race = function(promises) {
        if(!Array.isArray(promises)) {
            return new TypeError('参数必须是数组');
        }
        return new Promise((resolve, reject) => {
            for(let i=0; i<promises.length; i++) {
                promises[i].then(value => {
                    resolve(value);
                }, reason => {
                    reject(reason);
                })
            }
        })
    }

    root.Promise = Promise;

})(this)