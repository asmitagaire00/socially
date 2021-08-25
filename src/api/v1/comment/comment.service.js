const db = require('../../../helpers/db');

// eslint-disable-next-line no-use-before-define
module.exports = { createComment, deleteComment };

async function createComment(comment, userId, postId) {
  const newComment = await new db.Comment({
    comment,
    user: userId,
    post: postId,
  }).save();

  // add comment to User and Post collections
  Promise.all([
    await db.User.findOneAndUpdate(
      { _id: userId },
      { $push: { comments: newComment.id } },
    ),
    await db.Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: newComment.id } },
    ),
  ]);

  return newComment;
}

async function deleteComment(commentId) {
  const comment = await db.Like.findOneAndRemove({ id: commentId });

  // remove comment from Post and User collections
  Promise.all([
    await db.Post.findOneAndUpdate(
      { _id: comment.post },
      { $pull: { comments: comment.id } },
    ),
    await db.User.findOneAndUpdate(
      { _id: comment.user },
      { $pull: { likes: comment.id } },
    ),
  ]);

  return comment;
}
