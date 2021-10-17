const Joi = require('joi');
const validateRequest = require('../../../middleware/validateRequest');

// eslint-disable-next-line no-use-before-define
module.exports = { createConversationSchema };

function createConversationSchema(req, res, next) {
  const schema = Joi.object({
    userIds: Joi.array().items(Joi.string().length(24)).required(),
  });

  validateRequest(req, next, schema);
}
