/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();

const sendResponse = require('../../../lib/response/sendResponse');
const followService = require('./follow.service');
const authorize = require('../../../middleware/authorize');

module.exports = router;

router.post('/:id/follow', authorize(), followUser);
router.put('/:id/unfollow', authorize(), unfollowUser);

function followUser(req, res, next) {
  followService
    .followUser(req.params.id, req.body.id)
    .then((followInstance) =>
      sendResponse(res, followInstance, 'Follow user successful.'),
    )
    .catch(next);
}

function unfollowUser(req, res, next) {
  followService
    .unfollowUser(req.params.id, req.body.id)
    .then((unfollowInstance) =>
      sendResponse(res, unfollowInstance, 'Unfollow user successful.'),
    )
    .catch(next);
}
