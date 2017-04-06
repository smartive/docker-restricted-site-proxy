const express = require('express'),
    path = require('path'),
    helpers = require('./helpers'),
    loginUrl = '/proxy/login/' + helpers.guid(),
    router = express.Router({
        caseSensitive: false,
        strict: false
    }),
    httpProxy = require('http-proxy'),
    urlParser = require('body-parser').urlencoded({ extended: true }),
    options = { secure: false },
    authEnabled = helpers.env('PROXY_SITE_USERNAME', 'user') !== '' && helpers.env('PROXY_SITE_PASSWORD', 'pass') !== '';

if (!authEnabled) {
    console.warn('Authentication is not enabled!');
}

if (helpers.env('PROXY_TARGET_HOST')) {
    options.target = {
        host: helpers.env('PROXY_TARGET_HOST', 'google.ch'),
        port: helpers.env('PROXY_TARGET_PORT', 80)
    }
} else {
    options.target = helpers.env('PROXY_TARGET', 'http://google.ch');
}

const proxy = httpProxy.createProxyServer(options);

exports = module.exports = passport => {
    if (!passport) throw new Error('Passport auth must be set.');

    router
        .route(loginUrl)
        .get((req, res) => {
            if (req.query.logo) {
                return res.sendFile(path.join(__dirname, 'logo.png'));
            }
            res.sendFile(path.join(__dirname, 'login.html'));
        })
        .post(urlParser, passport.authenticate('local', { failureRedirect: loginUrl }), (req, res) => {
            res.redirect('/');
        });

    router
        .route('/*')
        .all((req, res) => {
            if (!req.isAuthenticated() && authEnabled) return res.redirect(loginUrl);
            proxy.web(req, res, err => {
                return res.end();
            });
        });

    return router;
};
