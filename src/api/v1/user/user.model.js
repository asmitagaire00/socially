const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  profileImage: String,
  coverImage: String,
  isOnline: { type: Boolean, default: false },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'Follow' }],
  following: [{ type: Schema.Types.ObjectId, ref: 'Follow' }],
  // messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  // notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    /* eslint-disable no-underscore-dangle */
    /* eslint-disable no-param-reassign */
    delete ret._id;
  },
});

// allow the model creation only once, if the model already exists just export it
// issue: if this model is required more than once or recompiled, mongoose throws OverwriteModelError.
/* eslint-disable dot-notation */

module.exports = mongoose.models['User']
  ? mongoose.models['User']
  : mongoose.model('User', schema);
