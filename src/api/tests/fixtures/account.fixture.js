/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');
const db = require('../../../helpers/db');
const { generateJwtToken } = require('../../v1/account/account.utils');

const accountPassword = 'teslaa';
const salt = bcryptjs.genSaltSync(10);
const passwordHash = bcryptjs.hashSync(accountPassword, salt);

const accountOne = {
  _id: mongoose.Types.ObjectId(),
  email: faker.internet.email().toLowerCase(),
  passwordHash,
  firstName: faker.name.findName(),
  lastName: faker.name.findName(),
};

const accountTwo = {
  _id: mongoose.Types.ObjectId(),
  email: faker.internet.email().toLowerCase(),
  passwordHash,
  firstName: faker.name.findName(),
  lastName: faker.name.findName(),
};

const accountVerifiedOne = {
  _id: mongoose.Types.ObjectId(),
  firstName: 'ggggg',
  lastName: 'ggggg',
  email: 'ggg@gmail.com',
  passwordHash,
  createdAt: '2021-08-15T07:18:57.178+00:00',
  verifiedAt: '2021-08-15T07:19:23.424+00:00',
};

const accountVerifiedTwo = {
  _id: mongoose.Types.ObjectId(),
  firstName: 'hhhhh',
  lastName: 'hhhhh',
  email: 'hhh@gmail.com',
  passwordHash,
  createdAt: '2021-08-13T07:18:57.178+00:00',
  verifiedAt: '2021-08-13T07:19:23.424+00:00',
};

const accountOneJwtToken = generateJwtToken(accountOne);

async function createAccounts(accounts) {
  await db.Account.insertMany(accounts);
}

module.exports = {
  accountOne,
  accountTwo,
  accountVerifiedOne,
  accountVerifiedTwo,
  accountPassword,
  accountOneJwtToken,
  createAccounts,
};
