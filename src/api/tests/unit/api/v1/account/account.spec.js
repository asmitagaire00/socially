const faker = require('faker');

const accountValidation = require('../../../../../v1/account/account.validation');
const {
  mockRequest,
  mockResponse,
  mockNext,
} = require('../../../../utils/expressMock');

describe('account validation using joi schema', () => {
  describe('contains register schema', () => {
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

    it('should correctly validate a valid user', () => {
      const req = mockRequest(newAccount);
      const res = mockResponse();
      const next = mockNext();

      accountValidation.registerSchema(req, res, next);

      // expect next() to be called
      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should throw a joi validation error if email is invalid', () => {
      newAccount.email = 'invalidEmail';

      const req = mockRequest(newAccount);
      const res = mockResponse();
      const next = mockNext();

      accountValidation.registerSchema(req, res, next);

      // expect next(err) to be called
      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);

      expect(next).toBeCalledWith(
        expect.objectContaining({
          code: 'VALIDATION_ERROR',
        }),
      );
    });
  });
});
