
function Compile(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
        this.$fragment = this.nodeToFragment(this.$el);
        this.compile(this.$fragment);
        this.$el.appendChild(this.$fragment);
    }
}

Compile.prototype = {
    constructor: Compile,

    compile: function (el) {
        const childNodes = el.childNodes;
        const reg = /\{\{(.*)\}\}/g;
        for (let i = 0; i < childNodes.length; i++) {
            const node = childNodes[i];
            if (this.isElementNode(node)) {
                this.compileElement(node);
            }
            if (this.isTextNode(node) && reg.test(node.textContent)) {
                this.compileText(node, RegExp.$1);
            }
            if (node.childNodes && node.childNodes.length) {
                this.compile(node);
            }
        }
    },
    nodeToFragment: function (el) {
        const fragment = document.createDocumentFragment();
        let child = null;
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    },
    compileElement: function (node) {
        const attrs = node.attributes;
        const vm = this.$vm;
        for(let i=0; i<attrs.length; i++) {
            const attr = attrs[i];
            const attrName = attr.name;
            if(this.isDirective(attrName)) {
                const dir = attrName.substring(2);
                const exp = attr.value;
                if(this.isEventDirective(dir)) {
                    compileUtil.eventHandle(node, vm, exp, dir);
                } else {
                    compileUtil[dir] && compileUtil[dir](node, vm, exp);
                }
                node.removeAttribute(attrName);
            }
        }
    },
    compileText: function (node, exp) {
        compileUtil.text(node, this.$vm, exp);
    },
    isElementNode: function (node) {
        return node.nodeType === 1;
    },
    isTextNode: function (node) {
        return node.nodeType === 3;
    },
    isDirective: function (attrName) {
        return attrName.indexOf('v-') === 0;
    },
    isEventDirective: function(dir) {
        return dir.indexOf('on') === 0;
    }
}

const compileUtil = {
    html: function(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },
    text: function(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },
    model: function(node, vm, exp) {
        const self = this;
        const oldVal = this._getVmVal(vm, exp);
        this.bind(node, vm, exp, 'model');
        node.addEventListener('input', function() {
            const newVal = this.value;
            if(oldVal === newVal) {
                return;
            }
            const timer = setTimeout(function() {
                clearTimeout(timer);
                self._setVmVal(vm, exp, newVal);
            });
        }, false);
    },
    bind: function(node, vm, exp, dir) {
        const updaterFunc = updater[dir + 'Updater'];
        updaterFunc && updaterFunc(node, this._getVmVal(vm, exp));
        
        new Watcher(vm, exp, function(val) {
            updaterFunc && updaterFunc(node, val);
        });
    },
    eventHandle: function(node, vm, exp, dir) {
        const eventType = dir.split(':')[1];
        const func = vm.$options.methods && vm.$options.methods[exp];
        if(eventType && func) {
            node.addEventListener(eventType, func.bind(vm), false);
        }
    },
    _getVmVal: function(vm, exp) {
        const exps = exp.split('.');
        let val = vm;
        exps.forEach(key => {
            key = key.trim();
            val = val[key];
        });
        return val;
    },
    _setVmVal: function(vm, exp, newVal) {
        const exps = exp.split('.');
        let val = vm;
        exps.forEach((key, index) => {
            key = key.trim();
            if(index === exps.length - 1) {
                val[key] = newVal;
            } else {
                val = val[key];
            }
        });
    }
}

const updater = {
    htmlUpdater: function(node, value) {
        node.innerHTML = typeof value === 'undefined' ? '' : value;
    },
    textUpdater: function(node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value;
    },
    modelUpdater: function(node, value) {
        node.value = typeof value === 'undefined' ? '' : value;
    }
}