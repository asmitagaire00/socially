const mapToApplicationError = require('../lib/error/mapToApplicationError');

/* eslint-disable no-use-before-define */
module.exports = validateRequest;

function validateRequest(req, next, joiSchema) {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  const { error, value } = joiSchema.validate(req.body, options);

  if (error) {
    const err = mapToApplicationError(error);
    next(err);
  } else {
    req.body = value;
    next();
  }
}
