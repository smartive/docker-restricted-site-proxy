var express = require('express'),
    app = express(),
    session = require('express-session'),
    passport = require('./auth'),
    router = require('./router')(passport),
    helpers = require('./helpers');

app.use(session({
    resave: false,
    secret: helpers.guid(),
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

exports = module.exports = app;