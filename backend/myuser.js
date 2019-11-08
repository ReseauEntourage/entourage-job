/* eslint-disable no-underscore-dangle */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {
  _id: 0,
  email: 'j.hospice@gmail.com',
  password: 'djslhutfrty356T6TGI',
  salt: 'YTFjhnjdkskg',
  setPassword(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto
      .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
      .toString('hex');
  },
  validatePassword(password) {
    const hash = crypto
      .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
      .toString('hex');
    return this.password === hash;
  },
  generateJWT() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
      },
      'secret'
    );
  },
  toAuthJSON() {
    return {
      _id: this._id,
      email: this.email,
      token: this.generateJWT(),
    };
  },
};
