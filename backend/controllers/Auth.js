/* eslint-disable no-underscore-dangle */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function setPassword(user, password) {
  // TODO
  // user.salt = crypto.randomBytes(16).toString('hex');
  // user.password = crypto
  //   .pbkdf2Sync(password, user.salt, 10000, 512, 'sha512')
  //   .toString('hex');
}

function validatePassword(user, password) {
  const hash = crypto
    .pbkdf2Sync(password, user.salt, 10000, 512, 'sha512')
    .toString('hex');
  return user.password === hash;
}

function generateJWT(user) {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      email: user.email,
      id: user._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    'secret'
  );
}

function toAuthJSON(user) {
  return {
    _id: user._id,
    email: user.email,
    token: generateJWT(user),
  };
}

module.exports = {
  _id: 0,
  email: 'j.hospice@gmail.com',
  password: 'djslhutfrty356T6TGI',
  salt: 'YTFjhnjdkskg',
  setPassword,
  validatePassword,
  generateJWT,
  toAuthJSON,
};
