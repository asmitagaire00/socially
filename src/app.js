const express = require('express');

const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const globalErrorHandler = require('./middleware/globalErrorHandler');
const swaggerRouter = require('./api/docs/swagger');
const accountRouter = require('./api/v1/account/account.controller');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

app.use('/api/v1/account', accountRouter);

// swagger docs
app.use('/api/v1/api-docs', swaggerRouter);

// global error handler
app.use(globalErrorHandler);

module.exports = app;
