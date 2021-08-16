const supertest = require('supertest');
const faker = require('faker');

const app = require('../../../../../../app');
const setupTestDB = require('../../../../utils/setupTestDB');
const db = require('../../../../../../helpers/db');
const {
  createAccounts,
  accountOne,
  accountOneJwtToken,
} = require('../../../../fixtures/account.fixture');

// setup test database and teardown processes
setupTestDB();

describe('Post routes', () => {
  let newPost;

  beforeEach(() => {
    newPost = {
      caption: faker.name.findName(),
      image: faker.name.findName(),
      user: faker.name.findName(),
    };
  });

  // describe('POST /post/create', () => {
  //   it('should return 200 ok and successfully create new post if data is valid', async () => {
  //     await createAccounts([accountOne]);

  //     const res = await supertest(app)
  //       .post('/api/v1/post/create')
  //       .set('Authorization', `Bearer ${accountOneJwtToken}`)
  //       .send(newPost)
  //       .expect(200);

  //     expect(res.body).toMatchObject({
  //       message: expect.anything(),
  //       success: true,
  //     });

  //     const dbUser = await db.Post.findOne({ user: newPost.user });
  //     expect(dbUser).toBeDefined();
  //   });
  // });
});
