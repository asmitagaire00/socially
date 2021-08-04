// eslint-disable-next-line no-use-before-define
module.exports = formatResponse;

function formatResponse(payload, message, overrides = {}) {
  return {
    data: payload,
    message,
    success: true,
    ...overrides,
  };
}
