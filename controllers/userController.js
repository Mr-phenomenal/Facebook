const User = require('../models/User');

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile (bio, name, profilePic)
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, bio, profilePic } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (profilePic) user.profilePic = profilePic; // For now, expect image URL

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Search Users by name or email
exports.searchUsers = async (req, res) => {
  const query = req.query.q;

  if (!query) return res.status(400).json({ message: "Query is required" });

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } }
    ]
  }).select('name email profilePic');

  res.json(users);
};