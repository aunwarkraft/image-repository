const imageController = require('../controllers/image.controller');
const {isAuthenticated} = require('./route.utils');

module.exports = (app) => {
  app.post('/api/images/', isAuthenticated, (req, res) => {
    imageController.uploadImage(req, res);
  });

  app.get('/api/images/mine', isAuthenticated, (req, res) => {
    imageController.getUserImages(req, res);
  });

  app.get('/api/images/public', isAuthenticated, (req, res) => {
    imageController.getPublicImages(req, res);
  });

  app.get('/api/images/mine/:id', isAuthenticated, (req, res) => {
    imageController.getUserImageById(req, res);
  });

  app.get('/api/images/public/:id', isAuthenticated, (req, res) => {
    imageController.getPublicImageById(req, res);
  });

  app.patch('/api/images/:id', isAuthenticated, (req, res) => {
    imageController.updateImageById(req, res);
  });

  app.delete('/api/images/:id', isAuthenticated, (req, res) => {
    imageController.deleteImageById(req, res);
  });
};
