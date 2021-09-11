const ApplicationError = require('../../../lib/error/ApplicationError');

module.exports = {
  EMAIL_ALREADY_TAKEN_VERIFIED: {
    type: ApplicationError.type.SOCIALLY,
    code: 'EMAIL_ALREADY_TAKEN_VERIFIED',
    message: 'Account with the given email address already exists!',
    statusCode: 400,
  },
  EMAIL_ALREADY_TAKEN_NOT_VERIFIED: {
    type: ApplicationError.type.SOCIALLY,
    code: 'EMAIL_ALREADY_TAKEN_NOT_VERIFIED',
    message:
      'Account with this email already exists! Please check your email for verification instructions.',
    statusCode: 400,
  },
  AUTH_WEAK_PASSWORD: {
    type: ApplicationError.type.SOCIALLY,
    code: 'AUTH_WEAK_PASSWORD',
    message: 'The given password is easy to guess, provide strong password!',
    statusCode: 400,
  },
  INCORRECT_CREDENTIALS: {
    type: ApplicationError.type.SOCIALLY,
    code: 'INCORRECT_CREDENTIALS',
    message: 'Incorrect email or password!',
    statusCode: 400,
  },
  EMAIL_VERIFICATION_FAILED: {
    type: ApplicationError.type.SOCIALLY,
    code: 'EMAIL_VERIFICATION_FAILED',
    message: 'Email verification failed!',
    statusCode: 400,
  },
  INVALID_REFRESH_TOKEN: {
    type: ApplicationError.type.SOCIALLY,
    code: 'INVALID_REFRESH_TOKEN',
    message: 'Invalid refresh token!',
    statusCode: 403,
  },
  REFRESH_TOKEN_NOT_FOUND: {
    type: ApplicationError.type.SOCIALLY,
    code: 'REFRESH_TOKEN_NOT_FOUND',
    message: 'Refresh token not found!',
    statusCode: 401,
  },
};
