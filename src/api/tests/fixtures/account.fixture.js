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
  userName: faker.name.findName() + Math.floor(Math.random() * 10000),
};
const accountOneJwtToken = generateJwtToken(accountOne);

const accountTwo = {
  _id: mongoose.Types.ObjectId(),
  email: faker.internet.email().toLowerCase(),
  passwordHash,
  firstName: faker.name.findName(),
  lastName: faker.name.findName(),
  userName: faker.name.findName() + Math.floor(Math.random() * 10000),
};

const accountVerifiedOne = {
  _id: mongoose.Types.ObjectId(),
  firstName: 'ggggg',
  lastName: 'ggggg',
  userName: 'ggggg123',
  email: 'ggg@gmail.com',
  passwordHash,
  createdAt: '2021-08-15T07:18:57.178+00:00',
  verifiedAt: '2021-08-15T07:19:23.424+00:00',
};

const accountVerifiedTwo = {
  _id: mongoose.Types.ObjectId(),
  firstName: 'hhhhh',
  lastName: 'hhhhh',
  userName: 'hhhhh123',
  email: 'hhh@gmail.com',
  passwordHash,
  createdAt: '2021-08-13T07:18:57.178+00:00',
  verifiedAt: '2021-08-13T07:19:23.424+00:00',
};

// creates accounts and respective users
// returns accounts array of objects, each object: {account, jwtToken}
async function createAccounts(accounts) {
  const accPromises = accounts.map(async (account) => {
    const user = new db.User();
    // eslint-disable-next-line no-param-reassign
    account.user = user.id;
    user.account = account.id;
    await user.save();
    return { account, jwtToken: generateJwtToken(account) };
  });

  const newAccounts = await Promise.all(accPromises);

  await db.Account.insertMany(newAccounts.map((account) => account.account));
  return newAccounts;
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
