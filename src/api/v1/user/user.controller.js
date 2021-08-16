/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();

const sendResponse = require('../../../lib/response/sendResponse');
const userService = require('./user.service');
const authorize = require('../../../middleware/authorize');

router.post('/:id/follow', authorize(), followUser);
router.put('/:id/unfollow', authorize(), unfollowUser);
router.get('/:id', authorize(), getUser);

module.exports = router;

function getUser(req, res, next) {
  userService
    .getUser(req.params.id)
    .then((user) => sendResponse(res, user, null))
    .catch(next);
}

function followUser(req, res, next) {
  userService
    .followUser(req.params.id, req.body.id)
    .then((followInstance) =>
      sendResponse(res, followInstance, 'Follow user successful.'),
    )
    .catch(next);
}

function unfollowUser(req, res, next) {
  userService
    .unfollowUser(req.params.id, req.body.id)
    .then((unfollowInstance) =>
      sendResponse(res, unfollowInstance, 'Unfollow user successful.'),
    )
    .catch(next);
}
