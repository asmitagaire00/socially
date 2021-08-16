/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();

const postService = require('./post.service');
const validation = require('./post.validation');
const authorize = require('../../../middleware/authorize');
const sendResponse = require('../../../lib/response/sendResponse');
const { parseMultiFormData } = require('../../../helpers/formidable');

router.post(
  '/create',
  authorize(),
  parseMultiFormData,
  validation.createPostSchema,
  createPost,
);

module.exports = router;

function createPost(req, res, next) {
  const postDetails = req.body;

  postService
    .createPost(postDetails)
    .then((post) => sendResponse(res, post, 'Post created successfully.'))
    .catch(next);
}
