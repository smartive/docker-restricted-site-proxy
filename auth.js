const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    helpers = require('./helpers');

passport.use(new LocalStrategy((user, password, done) => {
    if (user === helpers.env('PROXY_SITE_USERNAME', 'user') && password === helpers.env('PROXY_SITE_PASSWORD', 'pass')) {
        return done(null, { id: helpers.guid() });
    }
    return done(null, false);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    return done(null, { id: id });
});

exports = module.exports = passport;
