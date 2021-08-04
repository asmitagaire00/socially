const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  verifiedAt: Date,
  emailVerificationToken: String,
  createdAt: { type: Date, default: Date.now },
  passwordReset: Date,
  updatedAt: Date,
});

// eslint-disable-next-line func-names
schema.virtual('isVerified').get(function () {
  return !!this.verifiedAt;
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    /* eslint-disable no-underscore-dangle */
    /* eslint-disable no-param-reassign */
    delete ret._id;
    delete ret.passwordHash;
  },
});

// allow the model creation only once, if the model already exists just export it
// issue: if this model is required more than once or recompiled, mongoose throws OverwriteModelError.
/* eslint-disable dot-notation */

module.exports = mongoose.models['Account']
  ? mongoose.models['Account']
  : mongoose.model('Account', schema);
