// eslint-disable-next-line no-use-before-define
module.exports = formatError;

function formatError(error, overrides = {}) {
  return {
    error,
    success: false,
    ...overrides,
  };
}
