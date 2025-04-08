const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const chatController = require('../controllers/chatController');
const chatMediaUpload = require('../middlewares/chatUpload');

// Send text or media message
router.post(
  '/message',
  authMiddleware,
  chatMediaUpload.single('media'), // form field name should be `media`
  chatController.sendMessage
);
