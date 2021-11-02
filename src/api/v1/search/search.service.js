/* eslint-disable no-use-before-define */
const db = require('../../../helpers/db');

module.exports = { searchUsers, searchAll };

async function searchUsers(searchQuery, curUserId) {
  if (!searchQuery) return [];

  const query = {
    $or: [
      { userName: new RegExp(searchQuery, 'i') },
      { firstName: new RegExp(searchQuery, 'i') },
      { lastName: new RegExp(searchQuery, 'i') },
    ],
  };

  if (curUserId) {
    // eslint-disable-next-line dot-notation
    query['_id'] = {
      $ne: curUserId,
    };
  }

  const users = await db.Account.find(query)
    .select('userName email firstName lastName user')
    .populate({
      path: 'user',
      select: 'profileImage coverImage',
    })
    .limit(20);

  return users;
}

async function searchAll(searchQuery, curUserId) {
  if (!searchQuery) return [];

  const users = await searchUsers(searchQuery, curUserId);
  const posts = await db.Post.find({
    caption: new RegExp(searchQuery, 'i'),
  }).limit(10);

  const res = [...users, ...posts];

  return res.sort((a, b) => a.createdAt - b.createdAt);
}
