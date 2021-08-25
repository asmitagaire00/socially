const Joi = require('joi');
const validateRequest = require('../../../middleware/validateRequest');

// eslint-disable-next-line no-use-before-define
module.exports = { createCommentSchema };

function createCommentSchema(req, res, next) {
  // at least one of image or caption should be present
  const schema = Joi.object({
    comment: Joi.string(),
    postId: Joi.string(),
  });

  validateRequest(req, next, schema);
}
