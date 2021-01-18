const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  server_image_name: {
    type: String,
    required: true,
    index: true,
    unique: true,
    dropDups: true,
  },
  upload_image_name: {
    type: String,
    required: true,
    index: true,
  },
  uploaded_by: {
    type: String,
    required: true,
  },
  uploader_id: {
    type: String,
    required: true,
  },
  public: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports.Image = mongoose.model('Image', imageSchema);
