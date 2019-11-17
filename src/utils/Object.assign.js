
if (typeof Object.assign !== 'function') {
    Object.defineProperty(Object, 'assign', {
        value: function (target) {
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object')
            }
            let to = Object(target)
            let source
            for (let i = 1; i < arguments.length; i++) {
                source = arguments[i]
                if (source !== null) {
                    for (let key in source) {
                        if (!Object.prototype.hasOwnProperty.call(target, key)) {
                            to[key] = source[key]
                        }
                    }

                    Object.getOwnPropertySymbols(source).forEach(sym => {
                        if (!Object.prototype.hasOwnProperty.call(target, sym)) {
                            to[sym] = target[sym]
                        }
                    })
                }
            }

            return to
        },
        configurable: true,
        writable: true,
        enumerable: false
    })
}

// 更好的实现
function completeAssign (target) {
    let descriptors
    Array.prototype.slice(arguments, 1).forEach((source) => {
      descriptors = Object.keys(source).reduce((descriptor, key) => {
          descriptor[key] = Object.getOwnPropertyDescriptor(source, key)
          return descriptor
      }, {})

      Object.getOwnPropertySymbols(source).forEach((sym) => {
          let descriptor = Object.getOwnPropertyDescriptor(source, sym)
          if (descriptor.enumerable) {
            descriptors[sym] = descriptor
          }
      })
    })

    return Object.defineProperties(target, descriptors)
}