(function(global) {

    var id = 0,
        oHead = document.getElementsByTagName('head')[0];

    function jsonp(options) {
        var script = document.createElement('script'),
            data = options.data || {},
            url = options.url,
            callback = options.callback,
            fnName = 'jsonp' + id++;
        data['callback'] = fnName;
        
        var params = [];
        for(var key in data) {
            params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        };
        url = url.indexOf('?') > -1 ? url + '&' : url + '?';
        url += params.join('&');
        script.src = url;
        
        global[fnName] = function(res) {
            callback && callback(res);
            oHead.removeChild(script);
            delete global[fnName];
        };

        script.onerror = function(msg, url, line) {
            callback && callback({success: false});
            oHead.removeChild(script);
            global[fnName] && delete global[fnName];
        }

        script.type = 'text/javascript';
        oHead.appendChild(script);
    };

    global.jsonp = jsonp;

})(this); 