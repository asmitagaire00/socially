const mapToApplicationError = require('../lib/error/mapToApplicationError');

/* eslint-disable no-use-before-define */
module.exports = validateRequest;
/**
 *
 * @param {req} req express req obj
 * @param {next} next express next
 * @param {object} joiSchema joi schema object
 * @param {object} valSchema (optional) schema to be validated instead of req.body
 */
function validateRequest(req, next, joiSchema, valSchema) {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  const { error, value } = joiSchema.validate(valSchema || req.body, options);

  if (error) {
    const err = mapToApplicationError(error);
    next(err);
  } else {
    req.body = value;
    next();
  }
}
