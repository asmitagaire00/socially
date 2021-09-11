/* eslint-disable no-use-before-define */
const express = require('express');

const postService = require('./post.service');
const validation = require('./post.validation');
const authorize = require('../../../middleware/authorize');
const sendResponse = require('../../../lib/response/sendResponse');
const { parseMultiFormData } = require('../../../helpers/formidable');

const router = express.Router();

router.post(
  '/',
  authorize(),
  parseMultiFormData,
  validation.createPostSchema,
  createPost,
);
router.get('/:postId', authorize(), getPost);
router.get('/', authorize(), getPosts);
router.get('/all', authorize(), getFollowedPosts);

module.exports = router;

function createPost(req, res, next) {
  const { caption, image } = req.body;
  const user = req.user.id;

  postService
    .createPost({ caption, image, user })
    .then((post) => sendResponse(res, post, 'Post created successfully.'))
    .catch(next);
}

function getPost(req, res, next) {
  const { postId } = req.params;

  postService
    .getPost(postId)
    .then((post) => sendResponse(res, post, 'Get post successful.'))
    .catch(next);
}

function getPosts(req, res, next) {
  const { id: userId } = req.user;
  const { skip = 0, limit = 10 } = req.query;

  postService
    .getPosts(userId, skip, limit)
    .then(({ posts, count }) =>
      sendResponse(res, { posts, count }, 'Get posts successful.'),
    )
    .catch(next);
}

function getFollowedPosts(req, res, next) {
  const { id: userId } = req.user;
  const { skip = 0, limit = 10 } = req.query;

  postService
    .getFollowedPosts(userId, skip, limit)
    .then(({ posts, count }) =>
      sendResponse(res, { posts, count }, 'Get followed posts successful.'),
    )
    .catch(next);
}
