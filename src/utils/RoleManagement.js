import { USER_ROLES } from 'src/constants';

const checkUserAuthorization = (req, res, userId, next) => {
  if (
    req.payload.id === userId ||
    req.payload.email === userId ||
    req.payload.role === USER_ROLES.ADMIN
  ) {
    next();
  } else {
    return res.status(401).send({ message: 'Unauthorized' });
  }
};

const checkCandidatOrCoachAuthorization = (req, res, userId, next) => {
  if (
    (req.payload.role === USER_ROLES.CANDIDAT && req.payload.id === userId) ||
    (req.payload.role === USER_ROLES.COACH &&
      (req.payload.candidatId === userId || req.payload.id === userId)) ||
    req.payload.role === USER_ROLES.ADMIN
  ) {
    next();
  } else {
    return res.status(401).send({ message: 'Unauthorized' });
  }
};

export { checkUserAuthorization, checkCandidatOrCoachAuthorization };
