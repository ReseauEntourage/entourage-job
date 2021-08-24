const request = require('supertest');
const { getApp } = require('./helpers');
const userFactory = require('../factories/userFactory');

let app;

/**
 * Login a user
 *
 * @param {Object} user the user credentials
 * @param {string} user.email the user email
 * @param {string} user.password the user's password unhashed
 * @returns {{ token: string, id: string }} token and id (generated during user insertion in DB)
 */
const getTokenAndId = async (user) => {
  if (!app) {
    app = getApp();
  }
  const response = await request(app).post(`/api/v1/auth/login`).send({
    email: user.email,
    password: user.password,
  });

  return {
    token: response.body.user.token,
    id: response.body.user.id,
  };
};

/**
 * Create a user and/or get associated token
 *
 * @param {Object} props user data
 */
const createLoggedInUser = async (props = {}, insertDB = true) => {
  const user = await userFactory(props, {}, insertDB);
  const { token, id } = await getTokenAndId({
    ...user,
    password: props.password,
  });

  return {
    token,
    user: {
      ...user,
      id,
    },
  };
};

module.exports = {
  createLoggedInUser,
  getTokenAndId,
};
