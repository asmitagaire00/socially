const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId }],
    seenBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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
module.exports = mongoose.models['Conversation']
  ? mongoose.models['Conversation']
  : mongoose.model('Conversation', schema);
