/* eslint-disable no-underscore-dangle */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

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

  let candidatId = null;
  if(user.coach && user.coach.candidat) {
    candidatId = user.coach.candidat.id;
  }

  let coachId = null;
  if(user.candidat && user.candidat.coach) {
    coachId = user.candidat.coach.id;
  }

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
      candidatId,
      coachId
    },
    'secret'
  );
}

function toAuthJSON(user) {
  let candidat = null;
  if(user.coach && user.coach.candidat) {
    candidat = user.coach.candidat;
  }

  let coach = null;
  if(user.candidat && user.candidat.coach) {
    coach = user.candidat.coach;
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender,
    phone: user.phone,
    role: user.role,
    token: generateJWT(user),
    candidat,
    coach
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

const auth = (roles= []) => {

  return [
    expressJwt({
      secret: 'secret',
      userProperty: 'payload',
      getToken: getTokenFromHeaders,
      credentialsRequired: roles.length > 0,
    }),
    (req, res, next) => {
      if (roles.length > 0 && !roles.includes(req.payload.role)) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      next();
    }
  ];
};

module.exports = {
  auth,
  encryptPassword,
  generateJWT,
  toAuthJSON,
  validatePassword,
};
