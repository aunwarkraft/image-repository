const userController = require('../controllers/user.controller');
const {isAuthenticated} = require('./route.utils');

module.exports = (app) => {
  app.post('/api/users/signup', (req, res) => {
    userController.createUser(req, res);
  });

  app.post('/api/users/login', (req, res) => {
    userController.getUser(req, res);
  });

  app.get('/api/users/logout', isAuthenticated, (req, res) => {
    userController.deleteUserSession(req, res);
  });
};
