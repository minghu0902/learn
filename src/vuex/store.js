
function Store(options) {
    this._committing = false
    this._actions = {}
    this._mutations = {}
    this._wrapperGetters = {}
    this._modules = new ModuleCollection(options)
    this._modulesNamespaceMap = {}
    this._subscribers = []

    installModule(this, options.state, [], this._modules.root)
}

Store.prototype = {
    constructor: Store,

    commit: function (type, payload) {
        var entry = this._mutations[type]
        if (!entry) {
            return
        }
        this._withCommit(() => {
            entry.forEach(function commitIterator(handler) {
                handler(payload)
            })
        })
    },
    dispatch: function (type, payload) {
        var entry = this._actions[type]
        if (!entry) {
            return
        }
        return entry.length > 1 
            ? Promise.all(entry.map(handler => handler(payload)))
            : entry[0](payload)
    },
    /** 订阅函数，返回取消订阅的函数 */
    subscribe: function (fn) {
        var subs = this._subscribers
        if (subs.indexOf(fn) < 0) {
            subs.push(fn)
        }
        return () => {
            var i = subs.indexOf(fn)
            if (i > -1) {
                subs.splice(i, 1)
            }
        }
    },
    /* 确保通过mutation修改store的数据 */
    _withCommit: function (fn) {
        // 调用withCommit修改state的值时会将store的committing值置为true，内部会有断言检查该值，在严格模式下只允许使用mutation来修改store中的值，而不允许直接修改store的数值
        var committing = this._committing
        this._committing = true
        if (typeof fn === 'function') {
            fn()
        }
        this._committing = committing
    }
}

function installModule(store, rootState, path, module) {
    var isRoot = !path.length
    var namespace = store._modules.getNamespace(path)

    if (namespace) {
        store._modulesNamespaceMap[namespace] = module
    }

    if (!isRoot) {
        var parentState = getNestedState(rootState, path.slice(0, -1))
        var moduleName = path[path.length - 1]
        store._withCommit(() => {
            Vue.set(parentState, moduleName, module.state)
        })
    }

    var local = module.context = makeLocalContext(store, namespace, path)

    module.forEachMutations((fn, key) => {
        registerMutation(store, namespace + key, fn, local)
    })

    module.forEachActions((fn, key) => {
        registerAction(store, namespace + key, fn, local)
    })

    module.forEachGetter((fn, key) => {
        registerGetter(store, namespace + key, fn, local)
    })

    module.forEachChild((child, key) => {
        installModule(store, rootState, path.concat(key), child)
    })
}

function makeLocalContext(store, namespace, path) {
    var noNamespace = namespace === ''

    var local = {
        commit: noNamespace ? store.commit : (type, payload) => {
            store.commit(namespace + type, payload)
        },
        dispatch: noNamespace ? store.dispatch : (type, payload) => {
            return store.dispatch(namespace + type, payload)
        }
    }

    Object.defineProperties(local, {
        getters: {
            get() {
                return noNamespace ? store.getters : makeLocalGetters(store, namespace)
            }
        },
        state: {
            get() {
                return noNamespace ? store.state : getNestedState(store.state, path)
            }
        }
    })
}

function makeLocalGetters(store, namespace) {
    var gettersProxy = {}

    var splitPos = namespace.length
    Object.keys(store.getters).forEach(type => {
        if (type.slice(0, splitPos) !== namespace) {
            return
        }

        var localType = type.slice(splitPos)
        Object.defineProperty(gettersProxy, localType, {
            get: function () {
                return store.getters[type]
            },
            enumerable: true
        })
    })

    return gettersProxy
}

function registerMutation(store, type, handler, local) {
    var entry = store._mutations[type] || (store._mutations[type] = [])
    entry.push(function wrappedMutationHandler(payload) {
        handler.call(store, local.state, payload)
    })
}

function registerAction(store, type, handler, local) {
    var entry = store._actions[type] || (store._actions[type] = [])
    entry.push(function wrappedActionHandler(payload, cb) {
        var res = handler.call(store, {
            dispatch: local.dispatch,
            commit: local.commit,
            getters: local.getters,
            state: local.state,
            rootGetters: store.getters,
            rootState: store.state
        }, payload, cb)

        if (isPromise(res)) {
            res = Promise.resolve(res)
        }
        return res
    })
}

function registerGetter(store, type, rawGetter, local) {
    if (store._wrapperGetters[type]) {
        return
    }
    store._wrapperGetters[type] = function wrappedGetter(store) {
        return rawGetter(
            local.state,
            local.getters,
            store.state,
            store.getters
        )
    }
}

function getNestedState(state, path) {
    return path.length
        ? path.reduce((state, key) => state[key], state)
        : state
}