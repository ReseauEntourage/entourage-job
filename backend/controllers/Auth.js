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

// param expiration est la date de fin en secondes
function generateJWT(user, expiration) {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      email: user.email,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      gender: user.gender,
      role: user.role,
      exp: parseInt((expiration || expirationDate.getTime()) / 1000, 10),
    },
    'secret'
  );
}

function toAuthJSON(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender,
    phone: user.phone,
    role: user.role,
    token: generateJWT(user),
    candidatId: user.coach ? user.coach.candidat.id : null,
    coachId: user.candidat ? user.candidat.coach.id : null
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
  generateJWT,
  toAuthJSON,
  validatePassword,
};
