const User = require('../models/User');

// Send friend request
exports.sendRequest = async (req, res) => {
  try {
    const receiver = await User.findById(req.params.id);
    const sender = await User.findById(req.user.id);

    if (!receiver || !sender) return res.status(404).json({ message: "User not found" });

    if (receiver.friendRequests.includes(sender._id)) {
      return res.status(400).json({ message: "Already sent request" });
    }

    receiver.friendRequests.push(sender._id);
    sender.sentRequests.push(receiver._id);

    await receiver.save();
    await sender.save();

    res.json({ message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ message: "Error sending request" });
  }
};

// Accept friend request
exports.acceptRequest = async (req, res) => {
  try {
    const receiver = await User.findById(req.user.id);
    const sender = await User.findById(req.params.id);

    receiver.friends.push(sender._id);
    sender.friends.push(receiver._id);

    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== sender._id.toString());
    sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiver._id.toString());

    await receiver.save();
    await sender.save();

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: "Error accepting request" });
  }
};

// Reject friend request
exports.rejectRequest = async (req, res) => {
  try {
    const receiver = await User.findById(req.user.id);
    const sender = await User.findById(req.params.id);

    receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== sender._id.toString());
    sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== receiver._id.toString());

    await receiver.save();
    await sender.save();

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting request" });
  }
};

// Get friend list
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends', 'name profilePic');
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: "Error fetching friends" });
  }
};

// Unfriend
exports.unfriend = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id);

    user.friends = user.friends.filter(id => id.toString() !== friend._id.toString());
    friend.friends = friend.friends.filter(id => id.toString() !== user._id.toString());

    await user.save();
    await friend.save();

    res.json({ message: "Unfriended successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error unfriending user" });
  }
};
