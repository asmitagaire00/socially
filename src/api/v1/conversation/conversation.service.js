const db = require('../../../helpers/db');
const CommonError = require('../../../lib/error/commonErrors');
const ApplicationError = require('../../../lib/error/ApplicationError');

// eslint-disable-next-line no-use-before-define
module.exports = { createConversation, getMessagesByConvId, getUsers };

/**
 * Create a conversation
 * @param {string} userIds array of user ids
 * @returns new conversation
 */
async function createConversation(userIds) {
  const query = { users: userIds };
  const newConv = await new db.Conversation(query).save();
  return newConv;
}

/**
 * Get messages by conversation id
 * @param {string} convId conversation id
 * @returns messages
 */
async function getMessagesByConvId(convId) {
  const query = { conversation: convId };
  const conv = await db.Message.find(query);
  return conv;
}

/**
 * Get user details users in a conversation
 * @param {ObjectId} ids ids of list of users
 * @returns users list
 */
async function getUsers(convId) {
  const conv = await db.Conversation.findById(convId);
  const { users: userList } = conv;

  const query = { _id: { $in: userList } };

  const users = await db.User.find(query)
    .select('profileImage coverImage isOnline')
    .populate({
      path: 'account',
      select: 'userName email firstName lastName createdAt',
    });
  if (!users) {
    throw new ApplicationError(CommonError.RESOURCE_NOT_FOUND);
  }

  return users;
}
