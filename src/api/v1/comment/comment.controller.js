/* eslint-disable no-use-before-define */
const express = require('express');

const commentService = require('./comment.service');
const validation = require('./comment.validation');
const authorize = require('../../../middleware/authorize');
const sendResponse = require('../../../lib/response/sendResponse');

const router = express.Router();

router.post('/', authorize(), validation.createCommentSchema, makeComment);
router.delete('/:commentId', authorize(), deleteComment);

module.exports = router;

function makeComment(req, res, next) {
  const userId = req.user.id;
  const { comment, postId } = req.body;

  commentService
    .createComment(comment, userId, postId)
    .then((commentObj) =>
      sendResponse(res, commentObj, 'New comment created successfully.'),
    )
    .catch(next);
}

function deleteComment(req, res, next) {
  const { commentId } = req.params;

  commentService
    .deleteComment(commentId)
    .then((commentObj) =>
      sendResponse(res, commentObj, 'Deleted comment successfully.'),
    )
    .catch(next);
}
