/**
 * Provides consistent application wide error interface
 */
module.exports = class ApplicationError extends Error {
  static type = {
    SOCIALLY: 'SOCIALLY',
    INTERNAL: 'INTERNAL',
    NETWORK: 'NETWORK',
    UNKNOWN: 'UNKNOWN',
  };

  constructor(options, overrides = {}) {
    super();
    Object.assign(options, overrides);

    // eslint-disable-next-line no-prototype-builtins
    if (!ApplicationError.type.hasOwnProperty(options.type)) {
      throw new Error(
        `ApplicationError: ${options.type} is not a valid error type!`,
      );
    }

    if (!options.message) {
      throw new Error(`ApplicationError: error message is required!`);
    }

    if (!options.code) {
      throw new Error(`ApplicationError: error message is required!`);
    }

    this.name = 'ApplicationError';
    this.type = options.type;
    this.code = options.code;
    this.message = options.message;
    this.errors = options.errors;
    this.statusCode = options.statusCode;
    this.meta = options.meta;
  }
};
