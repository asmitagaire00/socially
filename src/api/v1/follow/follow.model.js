const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'Account' },
    follower: { type: Schema.Types.ObjectId, ref: 'Account' },
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
module.exports = mongoose.models['Follow']
  ? mongoose.models['Follow']
  : mongoose.model('Follow', schema);
