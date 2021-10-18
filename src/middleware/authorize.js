const jwt = require('jsonwebtoken');

const db = require('../helpers/db');
const accessEnv = require('../helpers/accessEnv');
const Error = require('../lib/error/commonErrors');
const ApplicationError = require('../lib/error/ApplicationError');

// eslint-disable-next-line no-use-before-define
module.exports = authorize;

function authorize() {
  let decodedToken;
  /* eslint-disable consistent-return */
  return async (req, res, next) => {
    if (!req.headers || !req.headers.authorization) {
      return next(
        new ApplicationError(Error.UNAUTHORIZED, {
          message: 'Unauthorized. Token not found in the header',
        }),
      );
    }

    const token = req.headers.authorization.split(' ')[1];
    // handle Authorization: Bearer null
    if (token === 'null') {
      return next(
        new ApplicationError(Error.UNAUTHORIZED, {
          message: 'Unauthorized. Bearer null.',
        }),
      );
    }

    try {
      const SECRET_JWT = accessEnv('SECRET_JWT');
      decodedToken = jwt.verify(token, SECRET_JWT);
    } catch (error) {
      return next(
        new ApplicationError(Error.UNAUTHORIZED, {
          message: `Unauthorized. ${error.message}.`,
        }),
      );
    }

    const account = await db.Account.findById(decodedToken.id);
    const user = await db.User.findById(decodedToken.user);
    const refreshTokens = await db.RefreshToken.find({ account: account.id });

    // attach user obj to the request
    req.account = account;
    req.user = user;
    req.account.ownsToken = (_token) =>
      !!refreshTokens.find((x) => x.token === _token);
    next();
  };
}
