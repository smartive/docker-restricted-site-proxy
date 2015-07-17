var express = require('express'),
    app = express(),
    passport = require('passport'),
    session = require('express-session'),
    LocalStrategy = require('passport-local').Strategy,
    httpProxy = require('http-proxy'),
    bodyParser = require('body-parser'),
    urlParser = bodyParser.urlencoded({ extended: true }),
    path = require('path'),
    router = express.Router({
        caseSensitive: false,
        strict: false
    }),
    proxy = httpProxy.createProxyServer({
        target: {
            host: 'localhost',
            port: 9000
        }
    });

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

var loginUrl = '/proxy/login/' + guid();

passport.use(new LocalStrategy(function (user, password, done) {
    if (user === 'test' && password === 'foobar') {
        return done(null, {id: guid()});
    }
    return done(null, false);
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    return done(null, {id: id});
});

router.route(loginUrl)
    .get(function (req, res) {
        if(req.query.logo){
            return res.sendFile(path.join(__dirname, 'logo.png'));
        }
        res.sendFile(path.join(__dirname, 'login.html'));
    })
    .post(urlParser, passport.authenticate('local', {failureRedirect: loginUrl}), function(req, res){
        res.redirect('/');
    });
router.route('/*')
    .all(function (req, res) {
        if(!req.isAuthenticated()) return res.redirect(loginUrl);
        proxy.web(req, res);
    });

app.use(session({
    resave: false,
    secret: guid(),
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.listen(8080, function () {
    console.log("app listening on 8080");
});