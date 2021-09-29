/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();

const sendResponse = require('../../../lib/response/sendResponse');
const userService = require('./user.service');
const authorize = require('../../../middleware/authorize');

router.get('/:id', authorize(), getUser);
router.get('/:userName/posts', authorize(), getPostsByUserName);

module.exports = router;

function getUser(req, res, next) {
  userService
    .getUser(req.params.id)
    .then((user) => sendResponse(res, user, null))
    .catch(next);
}

// get posts by username
function getPostsByUserName(req, res, next) {
  const { userName } = req.params;
  const { skip = 0, limit = 10 } = req.query;

  const _skip = parseInt(skip, 10);
  const _limit = parseInt(limit, 10);

  userService
    .getPostsByUserName(userName, _skip, _limit)
    .then(({ posts, count }) =>
      sendResponse(res, { posts, count }, 'Get posts by user id successful.'),
    )

    .catch(next);
}
