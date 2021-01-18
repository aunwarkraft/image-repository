const {User} = require('../models/user.model');
const bcrypt = require('bcrypt');
const passport = require('passport');

module.exports = {
  createUser: async (req, res) => {
    if (req.body.username === undefined || req.body.username.length === 0) {
      return res.status(400).json({
        error: {
          message: 'New user needs username',
        },
      });
    }

    if (req.body.password === undefined || req.body.password.length === 0) {
      return res.status(400).json({
        error: {
          message: 'New user needs password',
        },
      });
    }

    try {
      // since username unique constraint is not working properly, do a manual check
      const username = req.body.username;
      const password = req.body.password;
      User.findOne({username: username})
          .then((user) => {
            // Create new User
            if (!user) {
              const newUser = new User({username, password});
              // Hash password before saving in database
              bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                  return res.status(500).json({
                    error: err,
                  });
                }
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) {
                    return res.status(500).json({
                      error: err,
                    });
                  }
                  newUser.password = hash;
                  newUser
                      .save()
                      .then((user) => {
                        return res.status(201).json({
                          message: 'Success',
                          descript: 'New User Created',
                        });
                      })
                      .catch((err) => {
                        return res.statu(500).json({
                          error: err,
                        });
                      });
                });
              });
            } else {
              return res.status(409).json({
                error: {
                  message: 'Use a different username. This is already in use.',
                },
              });
            }
          })
          .catch((err) => {
            return res.status(500).json({
              error: err,
            });
          });
    } catch (error) {
      return res.status(500).json({
        error: {
          message: 'Error encountered while creating new user',
        },
      });
    }
  },

  getUser: (req, res, next) => {
    if (req.body.username === undefined || req.body.username.length === 0) {
      return res.status(400).json({
        error: {
          message: 'Need username to login',
        },
      });
    }

    if (req.body.password === undefined || req.body.password.length === 0) {
      return res.status(400).json({
        error: {
          message: 'Need password to login',
        },
      });
    }

    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return res.status(500).json({errors: err});
      }
      if (!user) {
        return res.status(404).json({
          error: {
            message: 'User not found',
          }});
      }
      req.logIn(user, function(err) {
        if (err) {
          return res.status(500).json({errors: err});
        }
        return res.status(200).json({success: `logged in ${user.id}`});
      });
    })(req, res, next);
  },

  deleteUserSession: (req, res, next) => {
    req.session.destroy(function() {
      res.clearCookie('connect.sid');
      return res.status(200).json({
        message: 'logout successful',
      });
    });
  },
};
