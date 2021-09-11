const supertest = require('supertest');
const faker = require('faker');

const app = require('../../../../../../app');
const setupTestDB = require('../../../../utils/setupTestDB');
const extractCookies = require('../../../../utils/extractCookies');
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

  describe('POST /accounts/register', () => {
    it('should return 200 ok and successfully create new user account if data is valid', async () => {
      const res = await supertest(app)
        .post('/api/v1/accounts/register')
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
        .post('/api/v1/accounts/register')
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
        .post('/api/v1/accounts/register')
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
        .post('/api/v1/accounts/register')
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

  describe('POST /accounts/verify-email', () => {
    it('should return 400 bad request if email verification token is not present in the request body', async () => {
      const body = { foo: 'gfgfdg' };
      const res = await supertest(app)
        .post('/api/v1/accounts/verify-email')
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

  describe('POST /accounts/login', () => {
    it('should return 200 ok if email and password is valid and match', async () => {
      await createAccounts([accountVerifiedOne]);
      const body = {
        email: accountVerifiedOne.email,
        password: accountPassword,
      };
      const res = await supertest(app)
        .post('/api/v1/accounts/login')
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
          user: expect.anything(),
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
        .post('/api/v1/accounts/login')
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

  describe('POST /accounts/refresh-token', () => {
    it('should return 200 ok if tokens were successfully refreshed', async () => {
      await createAccounts([accountVerifiedOne]);
      const body = {
        email: accountVerifiedOne.email,
        password: accountPassword,
      };
      const res1 = await supertest(app)
        .post('/api/v1/accounts/login')
        .send(body)
        .expect(200);

      const { refreshToken } = extractCookies(res1.headers);

      const refTokenCookie = `refreshToken=${refreshToken.value}; Path:${refreshToken.flags.Path}; Expires:${refreshToken.flags.Expires}; HttpOnly; Secure; SameSite: ${refreshToken.flags.SameSite}`;

      const res = await supertest(app)
        .post('/api/v1/accounts/refresh-token')
        .set('Cookie', [refTokenCookie])
        .expect(200);

      const { refreshToken: newRefreshToken } = extractCookies(res.headers);

      expect(newRefreshToken.value).not.toBe(refreshToken.value);
      expect(res.body).toEqual({
        data: {
          jwtToken: expect.anything(),
        },
        message: expect.anything(),
        success: true,
      });
    });

    it('should return 401 unauthorized if tokens were unable to be refreshed due to invalid refresh token', async () => {
      const invalidRefToken = 'refreshToken=foo';
      const res = await supertest(app)
        .post('/api/v1/accounts/refresh-token')
        .set('Cookie', [invalidRefToken])
        .expect(403);

      expect(res.body).toEqual({
        error: {
          name: 'ApplicationError',
          type: 'SOCIALLY',
          code: 'INVALID_REFRESH_TOKEN',
          message: expect.anything(),
          statusCode: 403,
        },
        success: false,
      });
    });
  });

  describe('POST /accounts/revoke-token', () => {
    it('should return 200 ok if token is revoked', async () => {
      await createAccounts([accountVerifiedOne]);
      const body = {
        email: accountVerifiedOne.email,
        password: accountPassword,
      };
      const res1 = await supertest(app)
        .post('/api/v1/accounts/login')
        .send(body)
        .expect(200);

      const { refreshToken } = extractCookies(res1.headers);
      const { jwtToken } = res1.body.data;

      const refTokenCookie = `refreshToken=${refreshToken.value}; Path:${refreshToken.flags.Path}; Expires:${refreshToken.flags.Expires}; HttpOnly; Secure; SameSite: ${refreshToken.flags.SameSite}`;

      const res = await supertest(app)
        .post('/api/v1/accounts/revoke-token')
        .set('Authorization', `Bearer ${jwtToken}`)
        .set('Cookie', [refTokenCookie])
        .send({
          refreshToken: refreshToken.value,
        })
        .expect(200);

      expect(res.body).toEqual({
        data: null,
        message: expect.anything(),
        success: true,
      });
    });

    it('should return 401 unauthorized if token was unable to be revoked due to invalid jwtToken', async () => {
      await createAccounts([accountVerifiedOne]);
      const body = {
        email: accountVerifiedOne.email,
        password: accountPassword,
      };
      const res1 = await supertest(app)
        .post('/api/v1/accounts/login')
        .send(body)
        .expect(200);

      const { refreshToken } = extractCookies(res1.headers);
      const { jwtToken } = res1.body.data;

      const res = await supertest(app)
        .post('/api/v1/accounts/revoke-token')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          refreshToken: `${refreshToken.value}foo`,
        })
        .expect(401);

      expect(res.body).toEqual({
        error: {
          name: 'ApplicationError',
          type: 'SOCIALLY',
          code: 'REFRESH_TOKEN_NOT_FOUND',
          message: expect.anything(),
          statusCode: 401,
        },
        success: false,
      });
    });
  });

  describe('POST /accounts/auto-login', () => {
    it('should return 200 ok  if auto login using just jwt token was successful', async () => {
      await createAccounts([accountVerifiedOne]);

      const body = {
        email: accountVerifiedOne.email,
        password: accountPassword,
      };
      const res1 = await supertest(app)
        .post('/api/v1/accounts/login')
        .send(body)
        .expect(200);

      const { refreshToken } = extractCookies(res1.headers);
      const { jwtToken } = res1.body.data;

      const refTokenCookie = `refreshToken=${refreshToken.value}; Path:${refreshToken.flags.Path}; Expires:${refreshToken.flags.Expires}; HttpOnly; Secure; SameSite: ${refreshToken.flags.SameSite}`;

      const res = await supertest(app)
        .post('/api/v1/accounts/auto-login')
        .set('Authorization', `Bearer ${jwtToken}`)
        .set('Cookie', [refTokenCookie])
        .expect(200);

      expect(res.body).toEqual({
        data: {
          createdAt: expect.anything(),
          email: expect.anything(),
          firstName: expect.anything(),
          id: expect.anything(),
          isVerified: true,
          lastName: expect.anything(),
          user: expect.anything(),
          verifiedAt: expect.anything(),
        },
        message: expect.anything(),
        success: true,
      });
    });
  });
});
