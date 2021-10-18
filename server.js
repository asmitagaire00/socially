const accessEnv = require('./src/helpers/accessEnv');

const PORT = accessEnv('PORT', 3000);
const NODE_ENV = accessEnv('NODE_ENV');
require('dotenv').config({ path: `.env.${NODE_ENV}` });

const app = require('./src/app');
const runSocket = require('./src/socket');
const log = require('./src/helpers/logger');
const { connectDB } = require('./src/helpers/db');

connectDB()
  .then(() =>
    app.listen(PORT, () => {
      log.info(`Server started in port ${PORT}.`);
    }),
  )
  .then((server) => {
    // init websocket for messaging and notifications
    runSocket(server);
  })
  .catch((error) => {
    log.debug(error);
  });

process.on('unhandledRejection', (error) => {
  log.debug(error);
  process.exit(1);
});
