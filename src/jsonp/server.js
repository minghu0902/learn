var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var queryString = require('querystring');

http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    var query = queryString.parse(url.parse(req.url).query);
    
    switch(pathname) {
        case '/':
            fs.readFile(path.resolve(__dirname, './index.html'), 'utf-8', function(err, data) {
                if(err) throw err;
                res.setHeader('Content-Type', 'text/html');
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data)
            });
            break;
        case '/jsonp':
            if(query.callback) {
                var data = {
                    text: query.text || 'jsonp测试'
                };
                res.setHeader('Content-Type', 'application/json utf-8');
                res.writeHead(200, { 'Content-Type': 'application/json utf-8' });
                res.end(query.callback+ '( '+ JSON.stringify(data) +' )');
            }
            res.end();
            break;
        default:
            res.end('404');
    }

}).listen(9090);