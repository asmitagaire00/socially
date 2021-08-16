const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    image: String,
    caption: String,
    location: String,
    url: String,
    tags: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
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
module.exports = mongoose.models['Post']
  ? mongoose.models['Post']
  : mongoose.model('Post', schema);
