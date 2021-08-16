/* eslint-disable no-underscore-dangle */
const db = require('../../../helpers/db');
const CommonError = require('../../../lib/error/commonErrors');
const PostError = require('./post.errors');
const ApplicationError = require('../../../lib/error/ApplicationError');
const {
  uploadSingleImageToCloudinary,
} = require('../../../helpers/cloudinary');

// eslint-disable-next-line no-use-before-define
module.exports = { createPost };

/**
 * Create a post
 * @param {*} postDetails post info object
 * @returns a new post
 */
async function createPost(postDetails) {
  const { caption, image, user } = postDetails;

  if (!caption && !image) {
    throw new ApplicationError(CommonError.BAD_REQUEST, {
      message: 'A post must have either a caption or an image!',
    });
  }

  // upload image to cloudinary
  let res;
  if (image) {
    res = await uploadSingleImageToCloudinary(image, 'posts');
    console.log('Cloud response: ', res);
    if (!res.secure_url) {
      throw new ApplicationError(PostError.IMAGE_UPLOAD_CLOUDINARY_FAILED);
    }
  }

  const imageUrl = res.secure_url;
  const imagePublicId = res.public_id;

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

  return newPost;
}
