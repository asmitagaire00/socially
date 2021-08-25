const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  beforeEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map(async (collection) =>
        collection.deleteMany(),
      ),
    );
  });

  afterAll(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map(async (collection) =>
        collection.deleteMany(),
      ),
    );
    return mongoose.disconnect();
  });
};

module.exports = setupTestDB;
