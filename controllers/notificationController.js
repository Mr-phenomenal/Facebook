const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver: req.user.id })
      .sort({ createdAt: -1 })
      .populate('sender', 'username profilePic')
      .populate('post', 'text');

    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get notifications' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification' });
  }
};
