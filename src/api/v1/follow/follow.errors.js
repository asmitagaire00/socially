const ApplicationError = require('../../../lib/error/ApplicationError');

module.exports = {
  INVALID_USER_OPERATION: {
    type: ApplicationError.type.SOCIALLY,
    code: 'INVALID_USER_OPERATION',
    message: 'Invalid operation on user account!',
    statusCode: 403,
  },
};
