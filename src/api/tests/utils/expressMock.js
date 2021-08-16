// eslint-disable-next-line no-use-before-define
module.exports = { mockRequest, mockResponse, mockNext };

function mockRequest(body, params) {
  return {
    body,
    ...params,
  };
}

function mockResponse() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn((value) => value);
  return res;
}

function mockNext() {
  return jest.fn();
}
