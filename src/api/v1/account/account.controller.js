/* eslint-disable no-prototype-builtins */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();

const sendResponse = require('../../../lib/response/sendResponse');
const ApplicationError = require('../../../lib/error/ApplicationError');
const AccountError = require('./account.errors');
const validation = require('./account.validation');
const accountService = require('./account.service');
const utils = require('./account.utils');
const authorize = require('../../../middleware/authorize');

router.post('/register', validation.registerSchema, register);
router.post('/login', validation.loginSchema, login);
router.post('/verify-email', validation.verifyEmailSchema, verifyEmail);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', authorize(), revokeToken);
router.post('/auto-login', authorize(), autoLogin);

module.exports = router;

function autoLogin(req, res) {
  sendResponse(res, req.account, '');
}

function register(req, res, next) {
  accountService
    .register(req.body, req.get('origin'))
    .then(() =>
      sendResponse(
        res,
        null,
        'Registration successful. Please check your email for verification.',
      ),
    )
    .catch(next);
}

function login(req, res, next) {
  accountService
    .authenticate(req.body, req.get('origin'))
    .then(({ refreshToken, ...account }) => {
      utils.setTokenInHttpOnlyCookie(res, refreshToken);
      sendResponse(res, account, 'Login successful.');
    })
    .catch(next);
}

function verifyEmail(req, res, next) {
  accountService
    .verifyEmail(req.body.emailVerificationToken)
    .then(() =>
      sendResponse(res, null, 'Registration successful. You can login now.'),
    )
    .catch(next);
}

function refreshToken(req, res, next) {
  if (
    !req.hasOwnProperty('cookies') &&
    !req.cookies.hasOwnProperty('refreshToken')
  ) {
    throw new ApplicationError(AccountError.INVALID_REFRESH_TOKEN);
  }

  const token = req.cookies.refreshToken;

  accountService
    .refreshToken(token)
    .then(({ refreshToken, ...account }) => {
      utils.setTokenInHttpOnlyCookie(res, refreshToken);
      sendResponse(res, account, '');
    })
    .catch(next);
}

// eslint-disable-next-line consistent-return
function revokeToken(req, res, next) {
  const token = req.body.refreshToken || req.cookies.refreshToken;

  if (!token || !req.account.ownsToken(token)) {
    throw new ApplicationError(AccountError.REFRESH_TOKEN_NOT_FOUND);
  }

  accountService
    .revokeToken(token)
    .then(() => sendResponse(res, null, 'Token revoked successfully.'))
    .catch(next);
}
