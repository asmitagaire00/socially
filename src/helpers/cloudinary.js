const uuid = require('uuid');
const cloudinary = require('cloudinary');

const accessEnv = require('./accessEnv');

const NODE_ENV = accessEnv('NODE_ENV');
const CLOUDINARY_SECRET = accessEnv('CLOUDINARY_SECRET');
const CLOUDINARY_API_KEY = accessEnv('CLOUDINARY_API_KEY');
const CLOUDINARY_CLOUD_NAME = accessEnv('CLOUDINARY_CLOUD_NAME');

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const rootFolder = NODE_ENV === 'production' ? 'socially' : 'dev';

// eslint-disable-next-line no-use-before-define
module.exports = { uploadSingleImageToCloudinary };

/**
 * Upload a single image to cloudinary
 * @param {string} imagePath path to an image
 * @param {string} folder name of the folder where image is to be saved
 * @param {string} imagePublicId id of the image
 */
function uploadSingleImageToCloudinary(imagePath, folder, imagePublicId) {
  // overwrite image if imagePublicId is present(in case of post updates)
  const options = imagePublicId
    ? { public_id: imagePublicId, overwrite: true }
    : { public_id: `${rootFolder}/${folder}/${uuid.v4()}` };

  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(imagePath, options, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}
