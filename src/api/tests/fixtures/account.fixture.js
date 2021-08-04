/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');

module.exports = {
  userOne,
  userTwo,
};

const password = 'somePassword1';
const salt = bcryptjs.genSaltSync(10);
const passwordHash = bcryptjs.hashSync(password, salt);

const userOne = {
  id: mongoose.Types.ObjectId(),
  email: faker.internet.email().toLowerCase(),
  passwordHash,
  firstName: faker.name.findName(),
  lastName: faker.name.findName(),
};

const userTwo = {
  id: mongoose.Types.ObjectId(),
  email: faker.internet.email().toLowerCase(),
  passwordHash,
  firstName: faker.name.findName(),
  lastName: faker.name.findName(),
};
