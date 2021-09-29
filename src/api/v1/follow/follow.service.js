const db = require('../../../helpers/db');
const ApplicationError = require('../../../lib/error/ApplicationError');
const FollowError = require('./follow.errors');

// eslint-disable-next-line no-use-before-define
module.exports = { followUser, unfollowUser };

/**
 * Follow a certain user
 * @param {*} id id of a user to be followed (req.params.id)
 * @param {*} curUserId id of a current user (req.body)
 */
async function followUser(id, curUserId) {
  if (id === curUserId) {
    throw new ApplicationError(FollowError.INVALID_USER_OPERATION, {
      message: 'Cannot follow yourself!',
    });
  }

  const follow = await db.Follow.findOne({ user: id, follower: curUserId });

  if (follow) {
    throw new ApplicationError(FollowError.INVALID_USER_OPERATION, {
      message: 'You already follow this user!',
    });
  }

  const followInstance = new db.Follow({ user: id, follower: curUserId });

  await followInstance.save();
  Promise.all([
    await db.User.findOneAndUpdate(
      { _id: id },
      { $push: { followers: followInstance.id } },
    ),
    await db.User.findOneAndUpdate(
      { _id: curUserId },
      { $push: { following: followInstance.id } },
    ),
  ]);

  return followInstance;
}

/**
 * Follow a certain user
 * @param {*} id id of a user to be unfollowed (req.params.id)
 * @param {*} curUserId id of a current user (req.body)
 */
async function unfollowUser(id, curUserId) {
  if (id === curUserId) {
    throw new ApplicationError(FollowError.INVALID_USER_OPERATION, {
      message: 'Cannot unfollow yourself!',
    });
  }

  const follow = await db.Follow.findOne({ user: id, follower: curUserId });

  if (!follow) {
    throw new ApplicationError(FollowError.INVALID_USER_OPERATION, {
      message: `You haven't followed this user to unfollow!`,
    });
  }

  const unfollowInstance = await db.Follow.findOneAndDelete({ user: id });
  Promise.all([
    await db.User.findOneAndUpdate(
      { _id: unfollowInstance.user },
      { $pull: { followers: unfollowInstance.id } },
    ),
    await db.User.findOneAndUpdate(
      { _id: unfollowInstance.follower },
      { $pull: { following: unfollowInstance.id } },
    ),
  ]);

  return unfollowInstance;
}
