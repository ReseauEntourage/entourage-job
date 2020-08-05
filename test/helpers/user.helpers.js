const request = require('supertest');
const {
  getApp
} = require('./helpers');
const userFactory = require('../factories/userFactory');

let app;

/**
 * Login a user
 * 
 * @param {Object} user 
 * @returns {string} token and id (generated during user creation)
 */
const getTokenAndId = async (user) => {
  if (!app) {
    app = getApp();
  }
  const response = await request(app)
    .post(`/api/v1/auth/login`)
    .send({
      email: user.email,
      password: user.password,
    });
  return {
    token: response.body.user.token,
    id: response.body.user.id
  };
}

/**
 * Create a user and get associated token
 * 
 * @param {Object} props user data
 */
const createLoggedInUser = async (props = {}) => {
  const user = await userFactory(props);
  const {
    token,
    id
  } = await getTokenAndId({
    ...user,
    password: props.password
  });

  return {
    token,
    user: {
      ...user,
      id
    }
  };
}

module.exports = createLoggedInUser;
