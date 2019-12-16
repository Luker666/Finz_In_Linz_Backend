const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// Load User model
const User = require('../models/users');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('../config/config.js');
const prodConfig = config.production;

module.exports = function(passport) {
/*
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
    );
*/

passport.use(new GoogleStrategy({
  clientID        : config.auth.google.clientId,
  clientSecret    : config.auth.google.clientSecret,
  callbackURL     : config.auth.google.callback
},
function(accessToken, refreshToken, profile, done) {
  User.findOne({
    'provider_ID': profile.id, provider: 'google'
  },function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      user = new User({
        name: profile.displayName,
            email: 'google',//profile.emails[0].value,
            provider: 'google',
            'provider_ID': profile.id
          });
      user.save(function(err) {
        if (err) console.log(err);
        return done(err, user);
      });
    } else {
                //found user. Return
                return done(err, user);
              }
            });
}
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
}
);
};