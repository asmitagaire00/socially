const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const accessEnv = require('./helpers/accessEnv');
const globalErrorHandler = require('./middleware/globalErrorHandler');
const swaggerRouter = require('./api/docs/swagger');
const accountRouter = require('./api/v1/account/account.controller');
const userRouter = require('./api/v1/user/user.controller');
const postRouter = require('./api/v1/post/post.controller');
const likeRouter = require('./api/v1/like/like.controller');
const followRouter = require('./api/v1/follow/follow.controller');
const commentRouter = require('./api/v1/comment/comment.controller');
const conversationRouter = require('./api/v1/conversation/conversation.controller');
const messageRouter = require('./api/v1/message/message.controller');

const app = express();
const NODE_ENV = accessEnv('NODE_ENV');

app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'dist')));

// NOTE: using cors for development only(webpack dev server runs frontend on separate url)
// this app sends the client build/assets on any(*) route(except /api route)
// so no need to host client separately, so no cors required
if (NODE_ENV !== 'production') {
  const CLIENT_URL = accessEnv('CLIENT_URL');
  console.log('cors enabled for: ', CLIENT_URL);
  app.use(
    cors({
      origin: CLIENT_URL,
      optionsSuccessStatus: 200, // for legacy browser support
      credentials: true,
    }),
  );
}

// routes
app.use('/api/v1/ping', (req, res) =>
  res.status(200).json({ message: 'Server running.' }),
);
app.use('/api/v1/accounts', accountRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/follows', followRouter);
app.use('/api/v1/conversations', conversationRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/api-docs', swaggerRouter);

app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// global error handler
app.use(globalErrorHandler);

module.exports = app;
