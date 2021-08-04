const formatResponse = require('./formatResponse');

// eslint-disable-next-line no-use-before-define
module.exports = sendResponse;

function sendResponse(res, payload, message, statusCode = 200) {
  return res.status(statusCode).json(formatResponse(payload, message));
}
