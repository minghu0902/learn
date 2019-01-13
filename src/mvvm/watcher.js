
function Watcher(vm, exp, cb) {
    this.$vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.depIds = {};
    this.value = this.get();
}

Watcher.prototype = {
    constructor: Watcher,

    update: function() {
        const oldVal = this.value;
        const newVal = this.get();
        if(oldVal === newVal) {
            return;
        }
        this.cb && this.cb(newVal, oldVal);
        this.value = newVal;
    },
    get: function() {
        Dep.target = this;
        const val = this._getVmVal(this.$vm, this.exp);
        Dep.target = null;
        return val;
    },
    addDep: function(dep) {
        if(!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    },
    _getVmVal: function(vm, exp) {
        let exps = exp.split('.');
        let val = vm;
        exps.forEach(key => {
            key = key.trim();
            val = val[key];
        });
        return val;
    }
}