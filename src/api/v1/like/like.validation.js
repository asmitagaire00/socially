const Joi = require('joi');
const validateRequest = require('../../../middleware/validateRequest');

// eslint-disable-next-line no-use-before-define
module.exports = { createLikeSchema };

function createLikeSchema(req, res, next) {
  // at least one of image or caption should be present
  const schema = Joi.object({
    postId: Joi.string().length(24).required(),
  });

  validateRequest(req, next, schema);
}
