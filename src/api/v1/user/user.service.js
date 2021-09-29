const db = require('../../../helpers/db');
const ApplicationError = require('../../../lib/error/ApplicationError');
const CommonError = require('../../../lib/error/commonErrors');

// eslint-disable-next-line no-use-before-define
module.exports = { getUser, getPostsByUserName };

/**
 * Get basic user details is returned from login service after logging in
 * @param {ObjectId} id id of a current user
 * @returns current user
 */
async function getUser(id) {
  const user = await db.User.findById(id)
    .populate('account')
    .populate('following')
    .populate('followers');
  if (!user) {
    throw new ApplicationError(CommonError.RESOURCE_NOT_FOUND);
  }
  return user;
}

// TODO: update user(authorized)

// TODO: delete user(authorized)

/**
 * Get all posts of a user by username
 * @param {string} userName username
 * @param {int} skip how many posts to skip
 * @param {int} limit how many posts to limit
 * @returns an object containing posts and count
 */
async function getPostsByUserName(userName, skip, limit) {
  const account = await db.Account.findOne({ userName });
  const { user: userId } = account;

  const query = { user: userId };
  const allPostsCount = await db.Post.find(query).countDocuments();
  const allPosts = await db.Post.find(query)
    .populate('likes')
    .populate({
      path: 'user',
      select: 'account',
      populate: {
        path: 'account',
        select: 'firstName lastName userName',
      },
    })
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 'desc' } },
      populate: { path: 'user' },
    })
    .sort({ createdAt: 'desc' })
    .skip(skip)
    .limit(limit);

  return { posts: allPosts, count: allPostsCount };
}
