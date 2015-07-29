var express = require('express'),
    path = require('path'),
    helpers = require('./helpers'),
    loginUrl = '/proxy/login/' + helpers.guid(),
    router = express.Router({
        caseSensitive: false,
        strict: false
    }),
    httpProxy = require('http-proxy'),
    urlParser = require('body-parser').urlencoded({extended: true});

var options = {secure: false};
if(helpers.env('PROXY_TARGET_HOST')){
    options.target = {
        host: helpers.env('PROXY_TARGET_HOST', 'google.ch'),
        port: helpers.env('PROXY_TARGET_PORT', 80)
    }
} else {
    options.target = helpers.env('PROXY_TARGET', 'http://google.ch');
}
var proxy = httpProxy.createProxyServer(options);

exports = module.exports = function (passport) {
    if (!passport) throw new Error('Passport auth must be set.');

    router
        .route(loginUrl)
        .get(function (req, res) {
            if (req.query.logo) {
                return res.sendFile(path.join(__dirname, 'logo.png'));
            }
            res.sendFile(path.join(__dirname, 'login.html'));
        })
        .post(urlParser, passport.authenticate('local', {failureRedirect: loginUrl}), function (req, res) {
            res.redirect('/');
        });

    router
        .route('/*')
        .all(function (req, res) {
            if (!req.isAuthenticated()) return res.redirect(loginUrl);
            proxy.web(req, res, function(err){
                return res.end();
            });
        });

    return router;
};