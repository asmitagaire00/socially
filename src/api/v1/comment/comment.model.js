const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    comment: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
  },
  { timestamps: true },
);

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    /* eslint-disable no-underscore-dangle */
    /* eslint-disable no-param-reassign */
    delete ret._id;
  },
});

/* eslint-disable dot-notation */
module.exports = mongoose.models['Comment']
  ? mongoose.models['Comment']
  : mongoose.model('Comment', schema);
