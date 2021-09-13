/* eslint-disable no-use-before-define */
const express = require('express');

const likeService = require('./like.service');
const validation = require('./like.validation');
const authorize = require('../../../middleware/authorize');
const sendResponse = require('../../../lib/response/sendResponse');

const router = express.Router();

router.post('/', authorize(), validation.createLikeSchema, like);
router.delete('/:likeId', authorize(), unlike);

module.exports = router;

function like(req, res, next) {
  const userId = req.user.id;
  const { postId } = req.body;

  likeService
    .createLike(userId, postId)
    .then((likeObj) => sendResponse(res, likeObj, 'Liked post successfully.'))
    .catch(next);
}

function unlike(req, res, next) {
  const { likeId } = req.params;

  likeService
    .deleteLike(likeId)
    .then((likeObj) => sendResponse(res, likeObj, 'Unliked post successfully.'))
    .catch(next);
}
