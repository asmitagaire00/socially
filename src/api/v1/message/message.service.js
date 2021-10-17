const db = require('../../../helpers/db');

// eslint-disable-next-line no-use-before-define
module.exports = { createMessage };

/**
 *
 * @param {Object} messageObj message object
 * @param {string} conversation conversation id
 * @param {string} sender sender id
 * @param {string} text message text
 * @returns new message object
 */
async function createMessage({ conversation, sender, text }) {
  const newMsg = await new db.Message({ conversation, sender, text }).save();
  return newMsg;
}
