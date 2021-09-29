/* eslint-disable no-underscore-dangle */
/* eslint-disable no-throw-literal */
/* eslint-disable no-use-before-define */
const bcryptjs = require('bcryptjs');

const db = require('../../../helpers/db');
const ApplicationError = require('../../../lib/error/ApplicationError');
const utils = require('./account.utils');
const AccountError = require('./account.errors');

module.exports = {
  register,
  authenticate,
  verifyEmail,
  refreshToken,
  revokeToken,
};

/**
 * Register a user account
 * @param {object} userData An object containing user details
 * @param {string} origin Domain originating the call
 */
async function register(userData, origin) {
  const account = await db.Account.findOne({ email: userData.email });

  // account exists and verified
  if (account && account.isVerified) {
    throw new ApplicationError(AccountError.EMAIL_ALREADY_TAKEN_VERIFIED);
  }

  // account exists and not verified
  if (account && !account.isVerified) {
    account.emailVerificationToken = utils.generateRandomToken();
    await account.save();
    await utils.sendVerificationEmail(account, origin);
    throw new ApplicationError(AccountError.EMAIL_ALREADY_TAKEN_NOT_VERIFIED);
  }

  const passwordHash = utils.hashPassword(userData.password);
  // eslint-disable-next-line no-param-reassign
  delete userData.password;
  // eslint-disable-next-line no-param-reassign
  delete userData.confirmPassword;

  const newAccount = new db.Account(userData);
  newAccount.passwordHash = passwordHash;
  newAccount.emailVerificationToken = utils.generateRandomToken();

  // generate a unique username
  newAccount.userName = `${userData.firstName}-${newAccount._id}`;

  const newUser = new db.User({ account: newAccount._id });
  newAccount.user = newUser._id;
  newUser.account = newAccount._id;

  await newUser.save();
  await newAccount.save();
  await utils.sendVerificationEmail(newAccount, origin);
}

/**
 * Authenticate an account
 * @param {object} userData An object containing user details
 * @param {string} origin Domain originating the call
 * @returns Authenticated user info
 */
async function authenticate(userData, origin) {
  const { email, password } = userData;

  const account = await db.Account.findOne({ email }).populate('user');

  // account valid and not verified
  if (!account || !bcryptjs.compareSync(password, account.passwordHash)) {
    throw new ApplicationError(AccountError.INCORRECT_CREDENTIALS);
  }

  if (account && !account.isVerified) {
    await utils.sendVerificationEmail(account, origin);
    throw new ApplicationError(AccountError.EMAIL_ALREADY_TAKEN_NOT_VERIFIED);
  }

  // valid user details so generate jwt access token and refresh token
  const jwtToken = utils.generateJwtToken(account);
  // eslint-disable-next-line no-shadow
  const refreshToken = utils.generateRefreshToken(account);

  await refreshToken.save();

  const {
    id,
    firstName,
    lastName,
    email: _email,
    createdAt,
    verifiedAt,
    user,
  } = account;

  return {
    id,
    firstName,
    lastName,
    email: _email,
    createdAt,
    verifiedAt,
    jwtToken,
    user,
    refreshToken: refreshToken.token,
  };
}

/**
 * Verify email based on verification token
 * @param {string} emailVerificationToken A token for verifying email
 */
async function verifyEmail(emailVerificationToken) {
  const account = await db.Account.findOne({ emailVerificationToken });

  if (!account) {
    throw new ApplicationError(AccountError.EMAIL_VERIFICATION_FAILED);
  }

  account.verifiedAt = Date.now();
  account.emailVerificationToken = undefined;

  await account.save();
}

/**
 * Replace token with new refresh token
 * @param {string} token Refresh token
 * @returns { object } Object containing new jwt and refresh token
 */
async function refreshToken(token) {
  const refToken = await db.RefreshToken.findOne({ token }).populate('account');
  if (!refToken || !refToken.isValid)
    throw new ApplicationError(AccountError.INVALID_REFRESH_TOKEN);

  const newRefToken = utils.generateRefreshToken(refToken.account);

  refToken.revokedAt = Date.now();
  refToken.replacedByToken = newRefToken.token;

  await refToken.save();
  await newRefToken.save();

  const newJwt = utils.generateJwtToken(refToken.account);

  return {
    jwtToken: newJwt,
    refreshToken: newRefToken.token,
  };
}

/**
 * Revoke token
 * @param {string} token Refresh token
 */
async function revokeToken(token) {
  const refToken = await db.RefreshToken.findOne({ token }).populate('account');

  refToken.revokedAt = Date.now();

  await refToken.save();
}
