/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');

const Account = require('../api/v1/account/account.model');
const RefreshToken = require('../api/v1/account/refresh-token.model');
const Follow = require('../api/v1/follow/follow.model');
const User = require('../api/v1/user/user.model');
const Post = require('../api/v1/post/post.model');
const Like = require('../api/v1/like/like.model');
const Comment = require('../api/v1/comment/comment.model');

module.exports = {
  connectDB,
  Account,
  RefreshToken,
  Follow,
  User,
  Post,
  Like,
  Comment,
};

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

function connectDB() {
  return mongoose.connect(process.env.MONGO_URI);
}
