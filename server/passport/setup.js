const bcrypt = require('bcrypt');
const {User}= require('../models/user.model');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Local Strategy
passport.use(
    new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
      // Match User
      User.findOne({username: username})
          .then((user) => {
            // Create new User
            if (user) {
              // Match password
              bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                  return done(null, false, {message: err});
                }
                if (isMatch) {
                  return done(null, user);
                } else {
                  return done(null, false, {message: 'Wrong password'});
                }
              });
            } else {
              return done(null, false, {message: 'user not found'});
            }
          })
          .catch((err) => {
            return done(null, false, {message: err});
          });
    }),
);

module.exports = passport;
