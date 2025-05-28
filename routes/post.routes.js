const express = require('express')
const router = express.Router();
const postController = require('../controllers/post.controller')
const {protect} = require('../middlewares/auth.middleware')

router.get('/', postController.getAllPosts)
router.get('/:id', postController.getSinglePost)

router.post('/', protect, postController.createPost)
router.patch('/:id', protect, postController.updatePost)
router.delete('/:id', protect, postController.deletePost)

module.exports = router;