const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

const customFields = {
    usernameField: 'email',
    passwordField: 'password'
}

const verifyCallback = (username, password, done) => {
    User.findOne({ email: username }).then(user => {
        if (!user) { return done(null, false); }
        if (!bcrypt.compare(password, user.password)) { return done(null, false); }
        return done(null, user);
    }).catch(err => {done(err)})};


const Strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(Strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId).then(user => {
        done(null, user);
    }).catch(err => done(err));
}
);