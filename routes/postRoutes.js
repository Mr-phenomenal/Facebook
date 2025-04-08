const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const postImageUpload = require('../middlewares/postImageUpload');

router.post('/', authMiddleware, postController.createPost);
router.get('/', authMiddleware, postController.getAllPosts);
router.put('/like/:id', authMiddleware, postController.toggleLike);
router.post('/comment/:id', authMiddleware, postController.addComment);
router.delete('/comment/:postId/:commentId', authMiddleware, postController.deleteComment); // optional
router.post('/create', authMiddleware, upload.single('image'), postController.createPost);
router.put('/:id/like', authMiddleware, postController.likePost);
router.post('/:id/comment', authMiddleware, postController.commentOnPost);



module.exports = router;
