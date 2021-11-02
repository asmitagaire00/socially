const ApplicationError = require('../../../lib/error/ApplicationError');

module.exports = {
  CONVERSATION_ALREADY_EXISTS: {
    type: ApplicationError.type.SOCIALLY,
    code: 'CONVERSATION_ALREADY_EXISTS',
    message: 'Conversation already exists!',
    statusCode: 400,
  },
};
