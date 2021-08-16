const mongoose = require('mongoose');

const ApplicationError = require('../lib/error/ApplicationError');
const CommonError = require('../lib/error/commonErrors');
const formatError = require('../lib/error/formatError');
const mapToApplicationError = require('../lib/error/mapToApplicationError');

// eslint-disable-next-line no-use-before-define
module.exports = globalErrorHandler;

// eslint-disable-next-line no-unused-vars
function globalErrorHandler(err, req, res, next) {
  console.log('Error from global error handler:', err);

  if (err instanceof ApplicationError) {
    return res.status(err.statusCode || 500).json(formatError(err));
  }

  // handle errors related to mongodb
  if (err instanceof mongoose.Error) {
    const internalError = new ApplicationError(
      CommonError.INTERNAL_SERVER_ERROR,
    );
    return res.status(err.statusCode || 500).json(formatError(internalError));
  }

  if (err instanceof Error) {
    try {
      const newError = mapToApplicationError(err);
      return res.status(err.statusCode || 500).json(formatError(newError));
    } catch (error) {
      // log error
      console.log('Error cannot map to application error: ', error);
      const unknownError = new ApplicationError(CommonError.UNKNOWN_ERROR);
      return res.status(err.statusCode || 500).json(formatError(unknownError));
    }
  }

  const unknownError = new ApplicationError(CommonError.UNKNOWN_ERROR);
  return res.status(err.statusCode || 500).json(formatError(unknownError));
}
