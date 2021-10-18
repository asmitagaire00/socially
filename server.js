const accessEnv = require('./src/helpers/accessEnv');

const PORT = accessEnv('PORT', 3000);
const NODE_ENV = accessEnv('NODE_ENV');
require('dotenv').config({ path: `.env.${NODE_ENV}` });

const { connectDB } = require('./src/helpers/db');
const app = require('./src/app');
const runSocket = require('./src/socket');

connectDB()
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server started in port ${PORT}.`);
    }),
  )
  .then((server) => {
    // init websocket for messaging and notifications
    runSocket(server);
  })
  .catch((error) => {
    console.error(error);
  });

process.on('unhandledRejection', (error) => {
  console.error(error);
  process.exit(1);
});
