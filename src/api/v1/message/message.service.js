const db = require('../../../helpers/db');

// eslint-disable-next-line no-use-before-define
module.exports = { createMessage };

/**
 *
 * @param {string} conversation conversation id
 * @param {string} sender sender id
 * @param {string} text message text
 * @param {Array} seenBy list of users id who saw this message
 * @returns new message object
 */
async function createMessage({ conversation, sender, text, seenBy }) {
  const newMsg = await new db.Message({
    conversation,
    sender,
    text,
  }).save();

  // mark current conv as seen by certain users
  await db.Conversation.findByIdAndUpdate(
    conversation,
    {
      seenBy: [...seenBy],
    },
    { new: true },
  );

  return newMsg;
}
