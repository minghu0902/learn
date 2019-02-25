
if (!Function.prototype.bind) {
    Function.prototype.bind = function () {
        var outerArgs = Array.prototype.slice.call(arguments, 1),
            context = arguments[0],
            func = this;
        function Bound() {
            var innerArgs = Array.prototype.slice.call(arguments),
                finalArgs = outerArgs.concat(innerArgs);
            // 如果用 new 的方式调用，则不改变 this 指向，否则就用传进来的 context
            func.apply(this instanceof Bound ? this : context, finalArgs);
        }
        function F() { }
        if (this.prototype) {
            F.prototype = this.prototype;
        }
        // 如果用 new 的方式调用的，则改实例应该继承到 func 的prototype
        Bound.prototype = new F();

        return Bound;
    }
}

if (!Function.prototype.call) {
    Function.prototype.call = function () {
        var context = arguments[0] || window,
            args = [],
            id = 0,
            result;
        // 为了防止 context 上存在 id
        while (context['fn' + id]) {
            id++;
        }
        context['fn' + id] = this;
        for (var i = 1; i < arguments.length; i++) {
            args.push('arguments[' + i + ']');
        }
        resule = eval('context["fn'+ id +'"](' + args + ')')
        delete context['fn' + id];
        return result;
    }
}

if (!Function.prototype.apply) {
    Function.prototype.apply = function () {
        var context = arguments[0] || window,
            params = arguments[1],
            id = 0,
            args = [],
            result;
        
        // 如果参数不是数组，则抛出错误
        if(params && !(params instanceof Array)) {
            throw new TypeError('CreateListFromArrayLike called on non-object');
        }
        while (context['fn' + id]) {
            id++;
        }
        context['fn' + id] = this;
        if (params && params.length) {
            for (var i = 0; i < params.length; i++) {
                args.push('params[' + i + ']');
            }
        }
        result = eval('context["fn'+ id +'"](' + args + ')');
        delete context['fn' + id];
        return result;
    }
}