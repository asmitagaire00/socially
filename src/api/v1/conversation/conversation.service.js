/* eslint-disable no-use-before-define */
const db = require('../../../helpers/db');
const CommonError = require('../../../lib/error/commonErrors');
const ApplicationError = require('../../../lib/error/ApplicationError');

module.exports = {
  createConversation,
  getMessagesByConvId,
  getUsers,
  getConversation,
  markAsSeen,
};

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
 * @param {string} convId conversation id
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

/**
 * Get conversation details
 * @param {string} convId conversation id
 * @returns {Conversation} conversation object
 */
async function getConversation(convId) {
  const conv = await db.Conversation.findById(convId);
  if (!conv) throw new ApplicationError(CommonError.RESOURCE_NOT_FOUND);

  return conv;
}

/**
 * Set conversation marked as seen to 'userIds'
 * @param {Object} obj
 * @param {string} obj.convId conversation id
 * @param {string} obj.userIds user ids list
 * @returns {Conversation} new conversation object
 */
async function markAsSeen({ convId, userIds }) {
  const conv = await db.Conversation.findById(convId);

  if (!conv) throw new ApplicationError(CommonError.RESOURCE_NOT_FOUND);

  const newLiveUsers = userIds.filter((u) => !conv.seenBy.includes(u));

  const updatedConv = await db.Conversation.findByIdAndUpdate(
    convId,
    {
      seenBy: [...conv.seenBy, ...newLiveUsers],
    },
    { new: true },
  );

  return updatedConv;
}
