const faker = require('faker');

const likeValidation = require('../../../../../v1/like/like.validation');
const {
  mockRequest,
  mockResponse,
  mockNext,
} = require('../../../../utils/expressMock');

describe('like validation using joi schema', () => {
  describe('contains like schema', () => {
    let newLike;

    beforeEach(() => {
      newLike = {
        userId: faker.datatype.string({ min: 24, max: 24 }),
        postId: faker.datatype.string({ min: 24, max: 24 }),
      };
    });

    it('should correctly validate a valid like', () => {
      const req = mockRequest(newLike);
      const res = mockResponse();
      const next = mockNext();

      likeValidation.createLikeSchema(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should throw a joi validation error if the like object contains no post id', () => {
      newLike.postId = undefined;

      const req = mockRequest(newLike);
      const res = mockResponse();
      const next = mockNext();

      likeValidation.createLikeSchema(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);

      expect(next).toBeCalledWith(
        expect.objectContaining({
          code: 'VALIDATION_ERROR',
        }),
      );
    });

    it('should throw a joi validation error if the post id is not valid(24 chars)', () => {
      newLike.postId = 'some invalid id';

      const req = mockRequest(newLike);
      const res = mockResponse();
      const next = mockNext();

      likeValidation.createLikeSchema(req, res, next);

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
