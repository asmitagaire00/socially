const supertest = require('supertest');
const faker = require('faker');

const app = require('../../../../../../app');
const setupTestDB = require('../../../../utils/setupTestDB');
const db = require('../../../../../../helpers/db');
const {
  createAccounts,
  accountVerifiedOne,
} = require('../../../../fixtures/account.fixture');

// setup test database and teardown processes
setupTestDB();

describe('Post routes', () => {
  let newPost;

  beforeEach(() => {
    newPost = {
      caption: faker.name.findName(),
    };
  });

  describe('POST /post/create', () => {
    it('should return 200 ok and successfully create new post if data is valid', async () => {
      const accounts = await createAccounts([accountVerifiedOne]);
      const bearerTokenOne = accounts[0].jwtToken;

      const res = await supertest(app)
        .post('/api/v1/post/create')
        .set('Authorization', `Bearer ${bearerTokenOne}`)
        .set('Content-type', 'multipart/form-data')
        .field({ caption: newPost.caption })
        .expect(200);

      expect(res.body).toEqual({
        data: {
          tags: expect.anything(),
          likes: expect.anything(),
          comments: expect.anything(),
          caption: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
          id: expect.anything(),
        },
        message: expect.anything(),
        success: true,
      });

      const dbPost = await db.Post.findOne({ id: res.body.data.id });
      expect(dbPost).toBeDefined();
    });
  });
});
