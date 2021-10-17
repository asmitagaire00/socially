/* eslint-disable no-use-before-define */
const db = require('../../../helpers/db');
const ApplicationError = require('../../../lib/error/ApplicationError');
const CommonError = require('../../../lib/error/commonErrors');

module.exports = {
  getUser,
  getAccountByUserName,
  getPostsByUserName,
  getFollowers,
  getFollowings,
  getConversationsByUserId,
};

/**
 * Get basic user details
 * @param {ObjectId} id id of a user
 * @returns user
 */
async function getUser(id) {
  const user = await db.User.findById(id)
    .select('profileImage coverImage isOnline')
    .populate({
      path: 'account',
      select: 'userName email firstName lastName createdAt',
    });
  if (!user) {
    throw new ApplicationError(CommonError.RESOURCE_NOT_FOUND);
  }
  return user;
}

async function getAccountByUserName(userName) {
  const account = await db.Account.findOne({ userName })
    .select('userName email firstName lastName user createdAt')
    .populate({
      path: 'user',
      select: 'profileImage coverImage isOnline',
    });

  if (!account) {
    throw new ApplicationError(CommonError.RESOURCE_NOT_FOUND, {
      message: 'User with corresponding username not found!',
    });
  }

  return account;
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
  if (!account) {
    throw new ApplicationError(CommonError.BAD_REQUEST, {
      message: 'Could not find the account with given username!',
    });
  }
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

// get followers of a certain user and check if curUserId 'isFollowing' userId
async function getFollowers(userId, curUserId, skip, limit) {
  const query = { user: userId };
  const allFollowersCount = await db.Follow.find(query).countDocuments();
  const allFollowers = await db.Follow.find(query)
    .populate({
      path: 'follower',
      select: 'account isOnline profileImage',
      populate: {
        path: 'account',
        select: 'firstName lastName userName id',
        options: { sort: { firstName: 'asc' } },
      },
    })
    .skip(skip)
    .limit(limit);

  // check if current logged in user follows userId
  const followingCount = await db.Follow.find({
    user: userId,
    follower: curUserId,
  }).countDocuments();
  const isCurUserFollowingUser = followingCount === 1;

  return {
    followers: allFollowers,
    count: allFollowersCount,
    isCurUserFollowingUser,
  };
}

// get followings of a certain user and check if userId 'isFollower' of curUserId
async function getFollowings(userId, curUserId, skip, limit) {
  const query = { follower: curUserId };
  const allFollowingsCount = await db.Follow.find(query).countDocuments();
  const allFollowings = await db.Follow.find(query)
    .populate({
      path: 'user',
      select: 'account isOnline profileImage',
      populate: {
        path: 'account',
        select: 'firstName lastName userName id',
        options: { sort: { firstName: 'asc' } },
      },
    })
    .skip(skip)
    .limit(limit);

  // check if userId 'isFollower' of current logged in user curUserId
  const followerCount = await db.Follow.find({
    user: curUserId,
    follower: userId,
  }).countDocuments();
  const isUserFollowingCurUser = followerCount === 1;

  return {
    followings: allFollowings,
    count: allFollowingsCount,
    isUserFollowingCurUser,
  };
}

/**
 * Get a conversation by user id
 * @param {string} userId user id
 * @returns conversation
 */
async function getConversationsByUserId(userId) {
  const query = { users: { $in: [userId] } };
  const conv = await db.Conversation.find(query);
  return conv;
}
