/* eslint-disable no-underscore-dangle */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwtExpress = require('express-jwt');

function encryptPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('hex');
  return { salt, hash };
}

function validatePassword(password, hash, salt) {
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('hex');
  return passwordHash === hash;
}

function generateJWT(user) {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      email: user.email,
      id: user.id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    'secret'
  );
}

function toAuthJSON(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    token: generateJWT(user),
  };
}

const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;
  console.log('auth :', authorization);

  if (authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwtExpress({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwtExpress({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = {
  auth,
  encryptPassword,
  validatePassword,
  generateJWT,
  toAuthJSON,
};
