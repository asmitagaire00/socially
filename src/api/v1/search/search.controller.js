/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();

const searchService = require('./search.service');
const authorize = require('../../../middleware/authorize');
const sendResponse = require('../../../lib/response/sendResponse');

router.get('/all/', authorize(), searchAll);
router.get('/users/', authorize(), searchUsers);

module.exports = router;

function searchUsers(req, res, next) {
  const searchQuery = req.query?.q;
  const { id: curUserId } = req.user;

  searchService
    .searchUsers(searchQuery, curUserId)
    .then((result) => sendResponse(res, result, 'Search users successful.'))
    .catch(next);
}

function searchAll(req, res, next) {
  const searchQuery = req.query?.q;
  const { id: curUserId } = req.user;

  searchService
    .searchAll(searchQuery, curUserId)
    .then((result) => sendResponse(res, result, 'Search all successful.'))
    .catch(next);
}
