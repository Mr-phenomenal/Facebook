const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: String, // Optional, for text messages
    mediaUrl: String, // Optional, for media messages
    mediaType: String, // image, video, audio, etc.
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
