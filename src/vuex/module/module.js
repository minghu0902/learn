
function Module(rawModule) {
    this._children = {}
    this._rawModule = rawModule
    this.state = rawModule.state || {}

    Object.defineProperties(this, {
        namespaced: {
            get: function () {
                return !!this._rawModule.namespaced
            }
        }
    })
}

Module.prototype = {
    constructor: Module,

    addChild: function (key, module) {
        this._children[key] = module
    },
    removeChild: function (key) {
        delete this._children[key]
    },
    getChild: function (key) {
        return this._children[key]
    },
    update: function (rawModule) {
        this._rawModule.namespaced = rawModule.namespaced
        
        if (rawModule.actions) {
            this._rawModule.actions = rawModule.actions
        }
        if (rawModule.mutations) {
            this._rawModule.mutations = rawModule.mutations
        }
        if (rawModule.getters) {
            this._rawModule.getters = rawModule.getters
        }
    },
    forEachChild: function (fn) {
        forEachValue(this._children, fn)
    },
    forEachGetter: function (fn) {
        if (this._rawModule.getters) {
            forEachValue(this._rawModule.getters, fn)
        }
    },
    forEachAction: function (fn) {
        if (this._rawModule.actions) {
            forEachValue(this._rawModule.action, fn)
        }
    },
    forEachMutation: function (fn) {
        if (this._rawModule.mutations) {
            forEachValue(this._rawModule.mutations, fn)
        }
    }
}
