/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
const db = require('../../../helpers/db');
const CommonError = require('../../../lib/error/commonErrors');
const PostError = require('./post.errors');
const ApplicationError = require('../../../lib/error/ApplicationError');
const {
  uploadSingleImageToCloudinary,
} = require('../../../helpers/cloudinary');

module.exports = {
  createPost,
  getPost,
  getPosts,
};

/**
 * Create a post
 * @param {object} postDetails post info object
 * @returns a new post
 */
async function createPost(postDetails) {
  const { caption, image, user } = postDetails;
  let imageUrl;
  let imagePublicId;

  if (!caption && !image) {
    throw new ApplicationError(CommonError.BAD_REQUEST, {
      message: 'A post must have either a caption or an image!',
    });
  }

  // upload image to cloudinary
  if (image) {
    const res = await uploadSingleImageToCloudinary(image, 'posts');
    if (!res.secure_url) {
      throw new ApplicationError(PostError.IMAGE_UPLOAD_CLOUDINARY_FAILED);
    }
    imageUrl = res.secure_url;
    imagePublicId = res.public_id;
  }

  const newPost = new db.Post({
    ...postDetails,
    image: imageUrl,
    imagePublicId,
  });

  await newPost.save();
  await db.User.findOneAndUpdate(
    { _id: user },
    { $push: { posts: newPost._id } },
  );

  const retPost = await db.Post.findById(newPost._id).populate({
    path: 'user',
    select: 'account',
    populate: {
      path: 'account',
      select: 'firstName lastName',
    },
  });

  return retPost;
}

/**
 * Returns a post based on post id
 * @param {string} postId Post id
 * @returns a post
 */
async function getPost(postId) {
  const post = await db.Post.findById(postId)
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
    });

  return post;
}

/**
 * Get all posts of a user
 * @param {string} userId user id
 * @param {int} skip how many posts to skip
 * @param {int} limit how many posts to limit
 * @param {boolean} followed include followed posts if true
 * @returns an object containing posts and count
 */
async function getPosts(userId, skip, limit, followed) {
  let query = null;
  // query based on 'followed' posts or posts made by user only
  if (followed) {
    const followingList = [];
    const followings = await db.Follow.find({ follower: userId }).select(
      'user',
    );
    followings.map((following) => followingList.push(following.user));

    query = { $or: [{ user: { $in: followingList } }, { user: userId }] };
  } else {
    query = { user: userId };
  }

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
