/* eslint-disable no-underscore-dangle */
const db = require('../../../helpers/db');
const CommonError = require('../../../lib/error/commonErrors');
const PostError = require('./post.errors');
const ApplicationError = require('../../../lib/error/ApplicationError');
const {
  uploadSingleImageToCloudinary,
} = require('../../../helpers/cloudinary');

// eslint-disable-next-line no-use-before-define
module.exports = { createPost, getPost, getPosts, getFollowedPosts };

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

async function getPost(postId) {
  const post = await db.Post.findById(postId)
    .populate('likes')
    .populate({
      path: 'user',
      select: 'account',
      populate: {
        path: 'account',
        select: 'firstName lastName',
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
 * @returns an object containing posts and count
 */
async function getPosts(userId, skip, limit) {
  const allPostsCount = await db.Post.find({ user: userId }).countDocuments();
  const allPosts = await db.Post.find({ user: userId })
    .populate('likes')
    .populate({
      path: 'user',
      select: 'account',
      populate: {
        path: 'account',
        select: 'firstName lastName',
      },
    })
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 'desc' } },
      populate: { path: 'user' },
    })
    .sort({ createdAt: 'desc' })
    .skip(parseInt(skip, 10))
    .limit(parseInt(limit, 10));

  return { posts: allPosts, count: allPostsCount };
}

/**
 * Get the posts followed by user(including the user posts as well)
 * @param {string} userId user id
 * @param {int} skip how many posts to skip
 * @param {int} limit how many posts to limit
 * @returns an object containing posts and count
 */
async function getFollowedPosts(userId, skip, limit) {
  const followingList = [];
  const followings = await db.Follow.find({ follower: userId }).select('user');
  followings.map((following) => followingList.push(following));

  const query = { $or: [{ user: { $in: followingList } }, { user: userId }] };

  const followedPostsCount = await db.Post.find(query).countDocuments();
  const followedPosts = await db.Post.find(query)
    .populate('likes')
    .populate({
      path: 'user',
      select: 'account',
      populate: {
        path: 'account',
        select: 'firstName lastName',
      },
    })
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 'desc' } },
      populate: { path: 'user' },
    })
    .sort({ createdAt: 'desc' })
    .skip(parseInt(skip, 10))
    .limit(parseInt(limit, 10));

  return { posts: followedPosts, count: followedPostsCount };
}
