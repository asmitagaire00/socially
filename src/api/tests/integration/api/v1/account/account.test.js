const supertest = require('supertest');
const faker = require('faker');

const app = require('../../../../../../app');
const setupTestDB = require('../../../../utils/setupTestDB');
const db = require('../../../../../../helpers/db');
const {
  userOne,
  createUsers,
} = require('../../../../fixtures/account.fixture');

// setup test database and teardown processes
setupTestDB();

describe('Socially server', () => {
  it('should ping the server', async () => {
    const res = await supertest(app).get('/api/v1/ping').expect(200);

    expect(res.body).toEqual({
      message: 'Server running.',
    });
  });
});

describe('Account routes', () => {
  let newUser;
  const password = 'somePassword1';

  beforeEach(() => {
    newUser = {
      firstName: faker.name.findName(),
      lastName: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      password,
      confirmPassword: password,
    };
  });

  describe('POST /account/register', () => {
    it('should return 200 ok and successfully create new user account if data is valid', async () => {
      const res = await supertest(app)
        .post('/api/v1/account/register')
        .send(newUser)
        .expect(200);

      expect(res.body).toEqual({
        data: null,
        message: expect.anything(),
        success: true,
      });

      const dbUser = await db.Account.findOne({ email: newUser.email });
      expect(dbUser).toBeDefined();
      expect(dbUser.passwordHash).not.toBe(newUser.password);
    });

    it('should return 400 bad request when email in invalid', async () => {
      newUser.email = 'invalid email';

      const res = await supertest(app)
        .post('/api/v1/account/register')
        .send(newUser)
        .expect(400);

      expect(res.body).toMatchObject({
        error: {
          name: 'ApplicationError',
          statusCode: 400,
        },
        success: false,
      });
    });

    it('should return 400 bad request when email is already taken', async () => {
      await createUsers([userOne]);

      newUser.email = userOne.email;

      const res = await supertest(app)
        .post('/api/v1/account/register')
        .send(newUser)
        .expect(400);

      expect(res.body).toMatchObject({
        error: {
          name: 'ApplicationError',
          statusCode: 400,
        },
        success: false,
      });
      // expected: 'EMAIL_ALREADY_TAKEN_VERIFIED' or 'EMAIL_ALREADY_TAKEN_NOT_VERIFIED'
      expect(res.body.error.code).toMatch(/EMAIL_ALREADY_TAKEN/);
    });

    it('should return 400 bad request when password length is less than 6 characters', async () => {
      newUser.password = 'four';

      const res = await supertest(app)
        .post('/api/v1/account/register')
        .send(newUser)
        .expect(400);

      expect(res.body).toMatchObject({
        error: {
          name: 'ApplicationError',
          code: 'VALIDATION_ERROR',
          statusCode: 400,
        },
        success: false,
      });
    });
  });

  describe('POST /account/verify-email', () => {
    it('should return 400 bad request if email verification token is not present in the request body', async () => {
      const body = { foo: 'gfgfdg' };
      const res = await supertest(app)
        .post('/api/v1/account/verify-email')
        .send(body)
        .expect(400);

      expect(res.body).toMatchObject({
        error: {
          name: 'ApplicationError',
          code: 'VALIDATION_ERROR',
          statusCode: 400,
        },
        success: false,
      });
    });
  });
});
