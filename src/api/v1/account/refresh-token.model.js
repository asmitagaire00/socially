const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  token: String,
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  revokedAt: Date,
  replacedByToken: String,
});

schema.virtual('isExpired').get(function () {
  return Date.now() >= this.expiresAt;
});

schema.virtual('isValid').get(function () {
  return !this.revokedAt && !this.isExpired;
});

// allow the model creation only once, if the model already exists just export it
// issue: if this model is required more than once or recompiled, mongoose throws OverwriteModelError.
/* eslint-disable dot-notation */

module.exports = mongoose.models['RefreshToken']
  ? mongoose.models['RefreshToken']
  : mongoose.model('RefreshToken', schema);
