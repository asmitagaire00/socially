const Joi = require('joi');
const validateRequest = require('../../../middleware/validateRequest');

// eslint-disable-next-line no-use-before-define
module.exports = { createPostSchema };

function createPostSchema(req, res, next) {
  // at least one of image or caption should be present
  const schema = Joi.object({
    image: Joi.any(),
    caption: Joi.string(),
    user: Joi.string().required(),
  }).or('image', 'caption');

  validateRequest(req, next, schema);
}
