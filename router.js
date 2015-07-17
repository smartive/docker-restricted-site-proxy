var express = require('express'),
    path = require('path'),
    helpers = require('./helpers'),
    loginUrl = '/proxy/login/' + helpers.guid(),
    router = express.Router({
        caseSensitive: false,
        strict: false
    }),
    httpProxy = require('http-proxy'),
    urlParser = require('body-parser').urlencoded({extended: true}),
    proxy = httpProxy.createProxyServer({
        target: {
            host: helpers.env('PROXY_TARGET_HOST', 'google.com'),
            port: helpers.env('PROXY_TARGET_PORT', '80')
        }
    });

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
            proxy.web(req, res);
        });

    return router;
};