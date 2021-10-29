/* eslint-disable no-use-before-define */
const express = require('express');

const messageService = require('./message.service');
const validation = require('./message.validation');
const authorize = require('../../../middleware/authorize');
const sendResponse = require('../../../lib/response/sendResponse');

const router = express.Router();

router.post('/', authorize(), validation.createMessageSchema, createMessage);

module.exports = router;

function createMessage(req, res, next) {
  const { conversation, sender, text, seenBy } = req.body;

  messageService
    .createMessage({ conversation, sender, text, seenBy })
    .then((msgObj) =>
      sendResponse(res, msgObj, 'Created message successfully.'),
    )
    .catch(next);
}
