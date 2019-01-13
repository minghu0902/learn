
let uid = 0;

function Dep() {
    this.subs = [];
    this.id = uid++;
}

Dep.target = null;

Dep.prototype = {
    constructor: Dep,

    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(sub => {
            sub.update();
        });
    },
    depend: function() {
        Dep.target.addDep(this);
    }
}

function observe(data) {
    if(typeof data !== 'object') {
        return;
    }
    Object.keys(data).forEach(key => {
        if(typeof data[key] === 'object') {
            observe(data[key]);
        } else {
            defineReactive(data, key, data[key]);
        }
    })
}

function defineReactive(obj, key, val) {
    const dep = new Dep();
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            if(Dep.target) {
                // 依赖收集
                dep.depend();
            }
            return val;
        },
        set: function(newVal) {
            if(val === newVal) {
                return;
            }
            val = newVal;
            dep.notify();
        }
    })
}