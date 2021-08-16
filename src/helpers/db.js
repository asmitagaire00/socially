const mongoose = require('mongoose');

const Account = require('../api/v1/account/account.model');
const RefreshToken = require('../api/v1/account/refresh-token.model');
const Follow = require('../api/v1/follow/follow.model');
const User = require('../api/v1/user/user.model');

// eslint-disable-next-line no-use-before-define
module.exports = { connectDB, Account, RefreshToken, Follow, User };

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

function connectDB() {
  return mongoose.connect(process.env.MONGO_URI);
}
