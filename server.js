require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const { connectDB } = require('./src/helpers/db');
const app = require('./src/app');
const runSocket = require('./src/socket');

const PORT = process.env.PORT || 3000;

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
