/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const config = require('../../../config/config.dev');
const db = require('../../../helpers/db');

module.exports = {
  hashPassword,
  sendEmail,
  sendVerificationEmail,
  generateRandomToken,
  generateJwtToken,
  generateRefreshToken,
  setTokenInHttpOnlyCookie,
};

async function sendVerificationEmail(account, origin) {
  let message;
  const verificationUrl = `${origin}/account/verify-email?token=${account.emailVerificationToken}`;

  if (!origin) {
    message = `<p>Please use the token below to verify the api route /account/verify-email</p>
                   <p>${account.emailVerificationToken}</p>`;
  } else {
    message = `<p>Please use this link to verify:</p>
                   <p><a href="${verificationUrl}">${verificationUrl}</a></p>`;
  }

  await sendEmail({
    to: account.email,
    subject: `Email verification from Socially`,
    html: `<h3>Verfiy email</h3>
               ${message}`,
  });
}

async function sendEmail({ to, subject, html, from = config.emailFrom }) {
  const transporter = nodemailer.createTransport(config.smtpOptions);
  await transporter.sendMail({ from, to, subject, html });
}

function hashPassword(password) {
  const saltRounds = 10;
  return bcryptjs.hashSync(password, saltRounds);
}

function generateRandomToken() {
  const byteSize = 40;
  return crypto.randomBytes(byteSize).toString('hex');
}

function generateJwtToken(account) {
  return jwt.sign(
    {
      sub: account.id || account._id,
      id: account.id || account._id,
      user: account.user,
    },
    process.env.SECRET_JWT,
    {
      expiresIn: '10m',
    },
  );
}

function generateRefreshToken(account) {
  return new db.RefreshToken({
    account: account.id || account._id,
    token: generateRandomToken(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
}

function setTokenInHttpOnlyCookie(res, token) {
  // sameSite and secure required to set cross origin cookies
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    // sameSite == 'none' requires secure(ie https). works in localhost too, fortunately.
    sameSite: 'none',
    // eslint-disable-next-line no-unneeded-ternary
    secure: true,
  };

  res.cookie('refreshToken', token, cookieOptions);
}
