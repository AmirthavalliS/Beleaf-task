const express = require('express');
const router = express.Router();
const { getAllPosts, updatePost, deletePost } = require('../controllers/postController');

router.get('/posts', getAllPosts);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

module.exports = router;
