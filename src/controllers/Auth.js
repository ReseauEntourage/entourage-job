import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import { getRelatedUser } from 'src/utils/Finding';
import { USER_ROLES } from 'src/constants';

function generateRandomPasswordInJWT(expiration) {
  const randomToken = crypto.randomBytes(128).toString('hex');
  const { salt, hash } = encryptPassword(randomToken);

  return {
    salt,
    hash,
    jwtToken: jwt.sign(
      {
        password: randomToken,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: expiration || '1d',
      }
    ),
  };
}

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

function decodeJWT(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log('Token invalid : ', err);
    return false;
  }
}

// param expiration est la date de fin en secondes
function generateJWT(user, expiration) {
  const relatedUser = getRelatedUser(user);

  let candidatId =
    user.role === USER_ROLES.COACH && relatedUser ? relatedUser.id : null;
  let coachId =
    user.role === USER_ROLES.CANDIDAT && relatedUser ? relatedUser.id : null;

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
      expiresIn: expiration || '60d',
    }
  );
}

function toAuthJSON(user) {
  const relatedUser = getRelatedUser(user);

  let candidat =
    user.role === USER_ROLES.COACH && relatedUser ? relatedUser : null;
  let coach =
    user.role === USER_ROLES.CANDIDAT && relatedUser ? relatedUser : null;

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
  decodeJWT,
  toAuthJSON,
  validatePassword,
  getTokenFromHeaders,
  generateRandomPasswordInJWT,
};
