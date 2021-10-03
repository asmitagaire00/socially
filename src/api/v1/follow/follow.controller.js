/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();

const sendResponse = require('../../../lib/response/sendResponse');
const followService = require('./follow.service');
const authorize = require('../../../middleware/authorize');

module.exports = router;

router.post('/:id/follow', authorize(), followUser);
router.delete('/:id/unfollow', authorize(), unfollowUser);

function followUser(req, res, next) {
  const { id: userId } = req.params;
  const { id: curUserId } = req.user;

  followService
    .followUser(userId, curUserId)
    .then((followInstance) =>
      sendResponse(res, followInstance, 'Follow user successful.'),
    )
    .catch(next);
}

function unfollowUser(req, res, next) {
  const { id: userId } = req.params;
  const { id: curUserId } = req.user;

  followService
    .unfollowUser(userId, curUserId)
    .then((unfollowInstance) =>
      sendResponse(res, unfollowInstance, 'Unfollow user successful.'),
    )
    .catch(next);
}
