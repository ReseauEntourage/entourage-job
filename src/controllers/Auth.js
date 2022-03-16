import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

function encryptPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('hex');

  return {
    salt,
    hash,
  };
}

function validatePassword(password, hash, salt) {
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('hex');

  return passwordHash === hash;
}

function isTokenValid(token) {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (err) {
    console.log('Token invalid : ', err);
    return false;
  }
}

// param expiration est la date de fin en secondes
function generateJWT(user, expiration) {
  let candidatId = null;
  if (user.coach && user.coach.candidat) {
    candidatId = user.coach.candidat.id;
  }

  let coachId = null;
  if (user.candidat && user.candidat.coach) {
    coachId = user.candidat.coach.id;
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      phone: user.phone,
      address: user.address,
      zone: user.zone,
      role: user.role,
      adminRole: user.adminRole,
      candidatId,
      coachId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: expiration || '60 days',
    }
  );
}

function toAuthJSON(user) {
  let candidat = null;
  if (user.coach && user.coach.candidat) {
    candidat = user.coach.candidat;
  }

  let coach = null;
  if (user.candidat && user.candidat.coach) {
    coach = user.candidat.coach;
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender,
    phone: user.phone,
    address: user.address,
    zone: user.zone,
    role: user.role,
    adminRole: user.adminRole,
    token: generateJWT(user),
    candidat,
    coach,
  };
}

const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

export const jwtMiddleware = (credentialsRequired) => {
  return expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    algorithms: ['HS256'],
    getToken: getTokenFromHeaders,
    credentialsRequired,
  });
};

const auth = (roles = []) => {
  return [
    jwtMiddleware(roles.length > 0),
    (req, res, next) => {
      if (roles.length > 0 && !roles.includes(req.payload.role)) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }
      return next();
    },
  ];
};

export {
  auth,
  encryptPassword,
  generateJWT,
  isTokenValid,
  toAuthJSON,
  validatePassword,
  getTokenFromHeaders,
};
