const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/comment.controller');
const { authenticateUser } = require('../middlewares/auth.middleware');

// All comments for a post
router.get('/', commentController.getCommentsByPost);

// Add comment to a post
router.post('/', authenticateUser, commentController.addComment);

module.exports = router;