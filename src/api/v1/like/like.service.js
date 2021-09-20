const mongoose = require('mongoose');

const LikeError = require('./like.errors');
const db = require('../../../helpers/db');
const ApplicationError = require('../../../lib/error/ApplicationError');

// eslint-disable-next-line no-use-before-define
module.exports = { createLike, deleteLike };

/**
 * Like a post
 * @param {string} userId user id
 * @param {string} postId post id
 * @returns like object
 */
async function createLike(userId, postId) {
  const like = await db.Like.findOne({ user: userId, post: postId });
  if (like) {
    throw new ApplicationError(LikeError.INVALID_LIKE_OPERATION, {
      message: 'Cannot like the same post again without unliking first!',
    });
  }

  const newLike = await new db.Like({ user: userId, post: postId }).save();

  // add like to Post and User collections
  Promise.all([
    await db.Post.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(postId) },
      { $push: { likes: newLike.id } },
    ),
    await db.User.findOneAndUpdate(
      { _id: userId },
      { $push: { likes: newLike.id } },
    ),
  ]);

  return newLike;
}

/**
 * Unlike a post
 * @param {string} userId user id
 * @param {string} postId post id
 * @returns like object that was deleted/unliked
 */
async function deleteLike(likeId) {
  const like = await db.Like.findOneAndRemove({ _id: likeId });

  // remove like from Post and User collections
  Promise.all([
    await db.Post.findOneAndUpdate(
      { _id: like.post },
      { $pull: { likes: like.id } },
    ),
    await db.User.findOneAndUpdate(
      { _id: like.user },
      { $pull: { likes: like.id } },
    ),
  ]);

  return like;
}
