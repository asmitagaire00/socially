/* eslint-disable no-use-before-define */
const express = require('express');

const conversationService = require('./conversation.service');
const validation = require('./conversation.validation');
const authorize = require('../../../middleware/authorize');
const sendResponse = require('../../../lib/response/sendResponse');

const router = express.Router();

router.post(
  '/',
  authorize(),
  validation.createConversationSchema,
  createConversation,
);
router.put('/:convId/seen', authorize(), markConvAsSeen);
router.get('/:convId', authorize(), getConversation);
router.get('/:convId/messages', authorize(), getMessagesByConvId);
router.get('/:convId/users', authorize(), getUsers);

module.exports = router;

function createConversation(req, res, next) {
  const { userIds } = req.body;

  conversationService
    .createConversation(userIds)
    .then((convObj) =>
      sendResponse(res, convObj, 'Created conversation successfully.'),
    )
    .catch(next);
}

function getMessagesByConvId(req, res, next) {
  const { convId } = req.params;

  conversationService
    .getMessagesByConvId(convId)
    .then((messagesObj) =>
      sendResponse(
        res,
        messagesObj,
        'Get message by conversation id successful.',
      ),
    )
    .catch(next);
}

function getUsers(req, res, next) {
  const { convId } = req.params;

  conversationService
    .getUsers(convId)
    .then((usersObj) =>
      sendResponse(res, usersObj, 'Get users by conversation id successful.'),
    )
    .catch(next);
}

function getConversation(req, res, next) {
  const { convId } = req.params;

  conversationService
    .getConversation(convId)
    .then((msgObj) => sendResponse(res, msgObj, 'Get conversation successful.'))
    .catch(next);
}

function markConvAsSeen(req, res, next) {
  const { convId } = req.params;
  const { userIds } = req.body;

  conversationService
    .markAsSeen({ convId, userIds })
    .then((convObj) =>
      sendResponse(res, convObj, 'Update conversation seen successful.'),
    )
    .catch(next);
}
