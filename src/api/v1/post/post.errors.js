const ApplicationError = require('../../../lib/error/ApplicationError');

module.exports = {
  IMAGE_UPLOAD_CLOUDINARY_FAILED: {
    type: ApplicationError.type.SOCIALLY,
    code: 'IMAGE_UPLOAD_CLOUDINARY_FAILED',
    message: 'Cannot post an image to cloudinary!',
    statusCode: 500,
  },
};
