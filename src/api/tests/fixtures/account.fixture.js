/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');
const db = require('../../../helpers/db');
const { generateJwtToken } = require('../../v1/account/account.utils');

const password = 'somePassword1';
const salt = bcryptjs.genSaltSync(10);
const passwordHash = bcryptjs.hashSync(password, salt);

const userOne = {
  _id: mongoose.Types.ObjectId(),
  email: faker.internet.email().toLowerCase(),
  passwordHash,
  firstName: faker.name.findName(),
  lastName: faker.name.findName(),
};

const userTwo = {
  _id: mongoose.Types.ObjectId(),
  email: faker.internet.email().toLowerCase(),
  passwordHash,
  firstName: faker.name.findName(),
  lastName: faker.name.findName(),
};

const userOneJwtToken = generateJwtToken(userOne);

async function createUsers(users) {
  await db.Account.insertMany(users);
}

module.exports = {
  userOne,
  userTwo,
  userOneJwtToken,
  createUsers,
};
