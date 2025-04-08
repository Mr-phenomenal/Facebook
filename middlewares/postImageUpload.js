const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Make sure this is correct path

// Cloudinary storage config for POST IMAGES
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'socialsphere-posts', // <- Different folder for posts
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1080, height: 1080, crop: 'limit' }], // optional
  },
});

// Create multer upload instance
const upload = multer({ storage });

module.exports = upload;
