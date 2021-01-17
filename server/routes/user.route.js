const userController = require('../controllers/user.controller');

module.exports = (app) => {
  app.post('/api/users/signup', (req, res) => {
    userController.createUser(req, res);
  });

  app.post('/api/users/login', (req, res) => {
    userController.getUser(req, res);
  });
};
