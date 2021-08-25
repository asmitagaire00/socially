/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');
const db = require('../../../helpers/db');

const postOne = {
  _id: mongoose.Types.ObjectId(),
  caption: faker.name.findName(),
};

const postTwo = {
  _id: mongoose.Types.ObjectId(),
  caption: faker.name.findName(),
  // image: null; TODO: test for post containing image
};

async function createPosts(posts) {
  const postList = await db.Post.insertMany(posts);
  return postList;
}

module.exports = {
  postOne,
  postTwo,
  createPosts,
};
