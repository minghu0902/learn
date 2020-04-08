
function ModuleCollection(rawRootModule) {
    this.register([], rawRootModule)
}

ModuleCollection.prototype = {
    constructor: ModuleCollection,

    /** 获取父级module  */
    get: function (path) {
        return path.reduce((module, key) => {
            return module.getChild(key)
        }, this.root)
    },
    /** 获取命名空间拼接的字符串，例如 'moduleName/name' */
    getNamespace: function (path) {
        var module = this.root
        return path.reduce((namespace, key) => {
            module = module.getChild(key)
            return namespace + (module.namespaced ? key + '/' : '')
        }, '')
    },
    register: function (path, rawModule) {
        var newModule = new Module(rawModule)

        if (path.length === 0) {
            this.root = newModule
        } else {
            var parent = this.get(path.slice(0, -1))
            parent.addChild(path[path.length - 1], newModule)
        }

        if (rawModule.modules) {
            forEachValue(rawModule.modules, (rawChildModule, key) => {
                register(path.concat(key), rawChildModule)
            })
        }
    }
}