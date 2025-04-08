const Post = require('../models/Post');
const Notification = require('../models/Notification');

// ✅ Create a new post (text + optional image)
exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;

    const newPost = new Post({
      user: req.user.id,
      text,
      image: req.file?.path || '', // Cloudinary URL if uploaded
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

// 👍 Like or unlike a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.includes(req.user.id);

    if (alreadyLiked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);

      // 🔔 Send notification if liking someone else's post
      if (post.user.toString() !== req.user.id) {
        await Notification.create({
          type: 'like',
          sender: req.user.id,
          receiver: post.user,
          post: post._id,
        });
      }
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? 'Post unliked' : 'Post liked',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// 💬 Comment on a post
exports.commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      user: req.user.id,
      text,
    };

    post.comments.push(comment);
    await post.save();

    // 🔔 Notify post owner if someone else comments
    if (post.user.toString() !== req.user.id) {
      await Notification.create({
        type: 'comment',
        sender: req.user.id,
        receiver: post.user,
        post: post._id,
      });
    }

    res.status(200).json({ message: 'Comment added', post });
  } catch (err) {
    res.status(500).json({ message: 'Failed to comment' });
  }
};

// ✅ Get all posts (optional for feed)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username profilePic')
      .populate('comments.user', 'username profilePic');

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};



// Delete a comment (optional)
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Only the comment owner or post owner can delete
    if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.remove();
    await post.save();

    res.json({ message: 'Comment deleted', comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};




// controllers/postController.js

const cloudinary = require('../utils/cloudinary');
const Post = require('../models/Post');
const fs = require('fs');

exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let imageUrl = '';

    // Handle image upload if present
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // remove temp file
    }

    const newPost = new Post({
      user: req.user.id,
      text,
      image: imageUrl
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

