const upload = require('../middlewares/uploadMiddleware');

// Upload profile pic route
router.post('/upload-profile-pic', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profilePic = req.file.path;
    await user.save();

    res.json({ message: 'Profile picture uploaded', imageUrl: req.file.path });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
});


// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Search users
router.get('/search', authMiddleware, userController.searchUsers);

module.exports = router;
