const faker = require('faker');

const postValidation = require('../../../../../v1/post/post.validation');
const {
  mockRequest,
  mockResponse,
  mockNext,
} = require('../../../../utils/expressMock');

describe('post validation using joi schema', () => {
  describe('contains post schema', () => {
    let newPost;

    beforeEach(() => {
      newPost = {
        caption: faker.name.findName(),
        image: faker.name.findName(),
        user: faker.name.findName(),
      };
    });

    it('should correctly validate a valid post', () => {
      const req = mockRequest(newPost);
      const res = mockResponse();
      const next = mockNext();

      postValidation.createPostSchema(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should throw a joi validation error if the post contains no user id', () => {
      newPost.user = undefined;

      const req = mockRequest(newPost);
      const res = mockResponse();
      const next = mockNext();

      postValidation.createPostSchema(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);

      expect(next).toBeCalledWith(
        expect.objectContaining({
          code: 'VALIDATION_ERROR',
        }),
      );
    });

    it('should throw a joi validation error if the post contains no image url and caption both', () => {
      newPost.image = undefined;
      newPost.caption = undefined;

      const req = mockRequest(newPost);
      const res = mockResponse();
      const next = mockNext();

      postValidation.createPostSchema(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);

      expect(next).toBeCalledWith(
        expect.objectContaining({
          code: 'VALIDATION_ERROR',
        }),
      );
    });

    it('should correctly validate if the post contains image url and no caption', () => {
      newPost.caption = undefined;

      const req = mockRequest(newPost);
      const res = mockResponse();
      const next = mockNext();

      postValidation.createPostSchema(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should correctly validate if the post contains caption and no image url', () => {
      newPost.caption = undefined;

      const req = mockRequest(newPost);
      const res = mockResponse();
      const next = mockNext();

      postValidation.createPostSchema(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
