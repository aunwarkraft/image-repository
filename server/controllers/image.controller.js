const {Image} = require('../models/image.model');
const fs = require('fs');
const multer = require('multer');
const uploadDirectory = './uploads/images';
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, uploadDirectory);
  },
  filename: function(req, file, callback) {
    // set filename and assign properties for image model
    const serverImageName = 'image_' + Date.now() + '_' + Math.round(Math.random() * 1E9);
    req.body.server_image_name = serverImageName;
    req.body.upload_image_name = file.originalname;
    callback(null, serverImageName);
  },
});

const uploadSingle = multer({storage: storage}).single('image');

module.exports = {
  uploadImage: (req, res) => {
    uploadSingle(req, res, function(err) {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      const newImage = new Image({
        server_image_name: req.body.server_image_name,
        upload_image_name: req.body.upload_image_name,
        uploaded_by: req.user.username,
        uploader_id: req.user._id,
        public: true,
      });
      newImage
          .save()
          .then((image) => {
            return res.status(201).json({
              message: 'Success',
              description: 'You have successfully uploaded ' + image.upload_image_name,
            });
          })
          .catch((err) => {
            return res.status(500).json({
              error: err,
            });
          });
    });
  },

  getPublicImages: (req, res) =>{
    Image.find({public: true}, function(err, images) {
      const imageMap = {};

      images.forEach(function(image) {
        imageMap[image._id] = {
          name: image.upload_image_name,
          uploaded_by: image.uploaded_by,
        };
      });

      res.status(200).json({
        images: imageMap,
      });
    });
  },

  getUserImages: (req, res) =>{
    Image.find({uploader_id: req.user._id}, function(err, images) {
      const imageMap = {};

      images.forEach(function(image) {
        imageMap[image._id] = {
          name: image.upload_image_name,
        };
      });

      res.status(200).json({
        images: imageMap,
      });
    });
  },

  getUserImageById: (req, res) =>{
    Image.findOne({uploader_id: req.user._id, _id: req.params.id})
        .then((image) => {
          if (!image) {
            return res.status(404).json({
              message: 'image not found',
            });
          }
          const fullpath = uploadDirectory + '/' + image.server_image_name;
          fs.access(fullpath, fs.constants.F_OK, (err) => {
            // check that we can access  the file
            if (err) {
              return res.status(500).json({
                error: error,
              });
            }
          });
          fs.readFile(fullpath, function(err, image) {
            if (err) {
              return res.status(404).json({
                error: err,
              });
            } else {
              res.writeHead(200, {'Content-type': 'image/jpg'});
              res.end(image);
            }
          });
        })
        .catch((err) => {
          return res.status(500).json({
            error: err,
          });
        });
  },

  getPublicImageById: (req, res) =>{
    Image.findOne({_id: req.params.id, public: true})
        .then((image) => {
          if (!image) {
            return res.status(404).json({
              message: 'image not found',
            });
          }
          const fullpath = uploadDirectory + '/' + image.server_image_name;
          fs.access(fullpath, fs.constants.F_OK, (err) => {
            // check that we can access  the file
            if (err) {
              return res.status(500).json({
                error: error,
              });
            }
          });
          fs.readFile(fullpath, function(err, image) {
            if (err) {
              return res.status(404).json({
                error: err,
              });
            } else {
              res.writeHead(200, {'Content-type': 'image/jpg'});
              res.end(image);
            }
          });
        })
        .catch((err) => {
          return res.status(500).json({
            error: err,
          });
        });
  },

  deleteImageById: (req, res) =>{
    Image.findOneAndDelete({uploader_id: req.user._id, _id: req.params.id})
        .then((image) => {
          if (!image) {
            return res.status(404).json({
              message: 'image not found',
            });
          }
          const fullpath = uploadDirectory + '/' + image.server_image_name;
          try {
            fs.access(fullpath, fs.constants.F_OK, (err) => {
            // check that we can access  the file
              if (err) {
                return res.status(500).json({
                  error: error,
                });
              }
            });
            fs.unlinkSync(fullpath);
            return res.status(200).json({
              message: 'Successfully deleted: ' + image.upload_image_name,
            });
          } catch (error) {
            return res.status(500).json({
              error: error,
            });
          }
        })
        .catch((err) => {
          return res.status(500).json({
            error: err,
          });
        });
  },
};
