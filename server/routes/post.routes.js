const Router = require('express');
const postController = require('../controller/post.controller');

const router = new Router();

router.post('/post', postController.createPost);
router.get('/post', postController.getPostByUser);

module.exports = router;
