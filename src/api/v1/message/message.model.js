const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String },
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
module.exports = mongoose.models['Message']
  ? mongoose.models['Message']
  : mongoose.model('Message', schema);
