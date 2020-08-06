const request = require('supertest');
const {
  getApp
} = require('./helpers');
const userFactory = require('../factories/userFactory');
const { USER_ROLES } = require('../../constants');
const {
  models: {
    User_Candidat,
  }
} = require('../../backend/db/models/');

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
 * Get a candidat url from the table user_candidat
 * 
 * @param {string} id of a user candidat
 */
const getCandidatUrl = async (id) => {
  const user = await User_Candidat.findOne({
    where: { candidatId: id },
    attributes: ['url']
  });
  return user;
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
  // const url = (user.role === USER_ROLES.CANDIDAT
  // ) ? (
  //     await getCandidatUrl(id)
  //   ) : (
  //     null
  //   );

  return {
    // url: url || null,
    token,
    user: {
      ...user,
      id
    }
  };
}

module.exports = createLoggedInUser;
