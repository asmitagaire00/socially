const jwt = require('jsonwebtoken');
const ApplicationError = require('../lib/error/ApplicationError');
const Error = require('../lib/error/commonErrors');
const db = require('../helpers/db');

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
      decodedToken = jwt.verify(token, process.env.SECRET_JWT);
    } catch (error) {
      return next(
        new ApplicationError(Error.UNAUTHORIZED, {
          message: `Unauthorized. ${error.message}.`,
        }),
      );
    }

    const user = await db.Account.findById(decodedToken.id);

    const refreshTokens = await db.RefreshToken.find({ account: user.id });

    // attach user obj to the request
    req.user = user;
    req.user.ownsToken = (_token) =>
      !!refreshTokens.find((x) => x.token === _token);
    next();
  };
}
