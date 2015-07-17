var service = require('./service'),
    http = require('http'),
    helpers = require('./helpers');

http.createServer(service).listen(helpers.env('PROXY_PORT', 80));