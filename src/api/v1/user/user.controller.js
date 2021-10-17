/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();

const sendResponse = require('../../../lib/response/sendResponse');
const userService = require('./user.service');
const authorize = require('../../../middleware/authorize');
const ApplicationError = require('../../../lib/error/ApplicationError');
const CommonError = require('../../../lib/error/commonErrors');

router.get('/:id', authorize(), getUser);
router.get('/:userName/posts', authorize(), getPostsByUserName);
router.get('/:userId/followers', authorize(), getFollowersByUserId);
router.get('/:userId/followings', authorize(), getFollowingsByUserId);
router.get('/:userName/account', authorize(), getAccountByUserName);
router.get('/:userId/conversations', authorize(), getConversationsByUserId);

module.exports = router;

function getUser(req, res, next) {
  userService
    .getUser(req.params.id)
    .then((user) => sendResponse(res, user, null))
    .catch(next);
}

function getAccountByUserName(req, res, next) {
  const { userName } = req.params;

  if (!userName) throw new ApplicationError(CommonError.BAD_REQUEST);

  userService
    .getAccountByUserName(userName)
    .then((user) => sendResponse(res, user, null))
    .catch(next);
}

function getPostsByUserName(req, res, next) {
  const { userName } = req.params;
  if (!userName) throw new ApplicationError(CommonError.BAD_REQUEST);
  const { skip = 0, limit = 10 } = req.query;

  const _skip = parseInt(skip, 10);
  const _limit = parseInt(limit, 10);

  userService
    .getPostsByUserName(userName, _skip, _limit)
    .then(({ posts, count }) =>
      sendResponse(res, { posts, count }, 'Get posts by user name successful.'),
    )

    .catch(next);
}

function getFollowersByUserId(req, res, next) {
  const { userId } = req.params;
  if (!userId) throw new ApplicationError(CommonError.BAD_REQUEST);
  const { id: curUserId } = req.user;
  const { skip = 0, limit = 10 } = req.query;

  const _skip = parseInt(skip, 10);
  const _limit = parseInt(limit, 10);

  userService
    .getFollowers(userId, curUserId, _skip, _limit)
    .then(({ followers, count, isCurUserFollowingUser }) =>
      sendResponse(
        res,
        { followers, count, isCurUserFollowingUser },
        'Get followers by user id successful.',
      ),
    )

    .catch(next);
}

function getFollowingsByUserId(req, res, next) {
  const { userId } = req.params;
  if (!userId) throw new ApplicationError(CommonError.BAD_REQUEST);
  const { id: curUserId } = req.user;
  const { skip = 0, limit = 10 } = req.query;

  const _skip = parseInt(skip, 10);
  const _limit = parseInt(limit, 10);

  userService
    .getFollowings(userId, curUserId, _skip, _limit)
    .then(({ followings, count, isUserFollowingCurUser }) =>
      sendResponse(
        res,
        { followings, count, isUserFollowingCurUser },
        'Get followings by user id successful.',
      ),
    )

    .catch(next);
}

function getConversationsByUserId(req, res, next) {
  const { userId } = req.params;

  if (!userId) throw new ApplicationError(CommonError.BAD_REQUEST);

  userService
    .getConversationsByUserId(userId)
    .then((conv) =>
      sendResponse(res, conv, 'Get conversation by user id successful.'),
    )
    .catch(next);
}
