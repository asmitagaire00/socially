const supertest = require('supertest');
const faker = require('faker');

const app = require('../../../../../../app');
const setupTestDB = require('../../../../utils/setupTestDB');
const db = require('../../../../../../helpers/db');
const {
  accountOne,
  accountVerifiedOne,
  createAccounts,
  accountPassword,
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
  let newAccount;
  const password = 'somePassword1';

  beforeEach(() => {
    newAccount = {
      firstName: faker.name.findName(),
      lastName: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      password,
      confirmPassword: password,
    };
  });

  it('should create accounts when createAccounts([,]) function is called', async () => {
    await createAccounts([accountOne]);

    const dbUser = await db.Account.findOne({ email: accountOne.email });
    expect(dbUser).toBeDefined();
  });

  describe('POST /account/register', () => {
    it('should return 200 ok and successfully create new user account if data is valid', async () => {
      const res = await supertest(app)
        .post('/api/v1/account/register')
        .send(newAccount)
        .expect(200);

      expect(res.body).toEqual({
        data: null,
        message: expect.anything(),
        success: true,
      });

      const dbUser = await db.Account.findOne({ email: newAccount.email });
      expect(dbUser).toBeDefined();
      expect(dbUser.passwordHash).not.toBe(newAccount.password);
    });

    it('should return 400 bad request when email in invalid', async () => {
      newAccount.email = 'invalid email';

      const res = await supertest(app)
        .post('/api/v1/account/register')
        .send(newAccount)
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
      await createAccounts([accountOne]);

      newAccount.email = accountOne.email;

      const res = await supertest(app)
        .post('/api/v1/account/register')
        .send(newAccount)
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
      newAccount.password = 'four';

      const res = await supertest(app)
        .post('/api/v1/account/register')
        .send(newAccount)
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

  describe('POST /account/login', () => {
    it('should return 200 ok if email and password is valid and match', async () => {
      await createAccounts([accountVerifiedOne]);
      const body = {
        email: accountVerifiedOne.email,
        password: accountPassword,
      };
      const res = await supertest(app)
        .post('/api/v1/account/login')
        .send(body)
        .expect(200);

      expect(res.body).toEqual({
        data: {
          id: expect.anything(),
          firstName: accountVerifiedOne.firstName,
          lastName: accountVerifiedOne.lastName,
          email: accountVerifiedOne.email,
          createdAt: expect.anything(),
          verifiedAt: expect.anything(),
          jwtToken: expect.anything(),
        },
        message: expect.anything(),
        success: true,
      });
    });

    it('should return 400 bad request if email and password does not match', async () => {
      await createAccounts([accountVerifiedOne]);
      const body = {
        email: accountVerifiedOne.email,
        password: 'wrongpassword',
      };
      const res = await supertest(app)
        .post('/api/v1/account/login')
        .send(body)
        .expect(400);

      expect(res.body).toEqual({
        error: {
          name: 'ApplicationError',
          type: 'SOCIALLY',
          code: 'INCORRECT_CREDENTIALS',
          message: expect.anything(),
          statusCode: 400,
        },
        success: false,
      });
    });
  });
});
