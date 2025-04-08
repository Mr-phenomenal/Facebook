const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const newMsg = new Message({
      conversationId,
      sender: req.user.id,
      text: text || '',
      mediaUrl: req.file?.path || '',
      mediaType: req.file?.mimetype?.split('/')[0] || '', // image/video/audio
    });

    await newMsg.save();
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
};
