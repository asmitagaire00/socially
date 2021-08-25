const ApplicationError = require('../../../lib/error/ApplicationError');

module.exports = {
  INVALID_LIKE_OPERATION: {
    type: ApplicationError.type.SOCIALLY,
    code: 'INVALID_USER_OPERATION',
    message: 'Invalid operation on like!',
    statusCode: 403,
  },
};
