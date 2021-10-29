const Joi = require('joi');
const validateRequest = require('../../../middleware/validateRequest');

// eslint-disable-next-line no-use-before-define
module.exports = { createMessageSchema };

function createMessageSchema(req, res, next) {
  const schema = Joi.object({
    conversation: Joi.string().length(24).required(),
    sender: Joi.string().length(24).required(),
    text: Joi.string().required(),
    seenBy: Joi.array().items(Joi.string().length(24)).required(),
  });

  validateRequest(req, next, schema);
}
