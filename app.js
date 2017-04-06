const service = {},
    http = require('http'),
    helpers = require('./helpers');

if (helpers.env('PROXY_SSL_CERT') && helpers.env('PROXY_SSL_KEY')) {
    const fs = require('fs'),
        path = require('path'),
        https = require('https'),
        cert = helpers.env('PROXY_SSL_CERT'),
        key = helpers.env('PROXY_SSL_KEY'),
        credentials = {
            key: fs.readFileSync(key[0] === '.' ? path.join(__dirname, key) : key),
            cert: fs.readFileSync(cert[0] === '.' ? path.join(__dirname, cert) : cert)
        };
    service = require('./service')(true);

    https.createServer(credentials, service).listen(helpers.env('PROXY_SSL_PORT', 443), () => {
        console.log('secure (https) site proxy listening on port: ' + helpers.env('PROXY_SSL_PORT', 443));
    });
} else {
    service = require('./service')(false);
}

http.createServer(service).listen(helpers.env('PROXY_PORT', 80), () => {
    console.log('site proxy listening on port: ' + helpers.env('PROXY_PORT', 80));
});
