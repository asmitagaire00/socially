/* eslint-disable no-underscore-dangle */
const supertest = require('supertest');
const faker = require('faker');

const app = require('../../../../../../app');
const setupTestDB = require('../../../../utils/setupTestDB');
const db = require('../../../../../../helpers/db');
const {
  createAccounts,
  accountVerifiedOne,
} = require('../../../../fixtures/account.fixture');
const { createPosts, postOne } = require('../../../../fixtures/post.fixture');

// setup test database and teardown processes
setupTestDB();

describe('Like routes', () => {
  let newLike;

  beforeEach(() => {
    newLike = {
      postId: faker.datatype.string({ min: 24, max: 24 }),
    };
  });

  describe('POST LIKE /like', () => {
    it('should return 200 ok and successfully create new like object if data is valid', async () => {
      const accounts = await createAccounts([accountVerifiedOne]);
      const bearerTokenOne = accounts[0].jwtToken;
      const posts = await createPosts([postOne]);

      newLike.postId = posts[0]._id;

      const res = await supertest(app)
        .post('/api/v1/like/')
        .set('Authorization', `Bearer ${bearerTokenOne}`)
        .send(newLike)
        .expect(200);

      expect(res.body).toEqual({
        data: {
          post: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything(),
          id: expect.anything(),
        },
        message: expect.anything(),
        success: true,
      });

      const dbLike = await db.Like.findOne({ id: res.body.data.id });
      expect(dbLike).toBeDefined();
    });
  });
});
