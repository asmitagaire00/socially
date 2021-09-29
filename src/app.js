const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./middleware/globalErrorHandler');
const swaggerRouter = require('./api/docs/swagger');
const accountRouter = require('./api/v1/account/account.controller');
const userRouter = require('./api/v1/user/user.controller');
const postRouter = require('./api/v1/post/post.controller');
const likeRouter = require('./api/v1/like/like.controller');
const followRouter = require('./api/v1/follow/follow.controller');
const commentRouter = require('./api/v1/comment/comment.controller');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'dist')));

// allow requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  }),
);

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
app.use('/api/v1/api-docs', swaggerRouter);

app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// global error handler
app.use(globalErrorHandler);

module.exports = app;
