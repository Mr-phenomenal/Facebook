const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const friendController = require('../controllers/friendController');

router.post('/request/:id', authMiddleware, friendController.sendRequest);
router.post('/accept/:id', authMiddleware, friendController.acceptRequest);
router.post('/reject/:id', authMiddleware, friendController.rejectRequest);
router.get('/list', authMiddleware, friendController.getFriends);
router.delete('/unfriend/:id', authMiddleware, friendController.unfriend);

module.exports = router;
