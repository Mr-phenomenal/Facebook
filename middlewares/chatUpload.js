const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const chatMediaStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'socialsphere-chat-media',
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mp3', 'gif'],
  },
});

const chatMediaUpload = multer({ storage: chatMediaStorage });

module.exports = chatMediaUpload;
