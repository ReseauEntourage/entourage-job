const express = require('express');

const router = express.Router();
const passport = require('passport');
const auth = require('../auth');
const authController = require('../controllers/Auth');
const UserController = require('../controllers/User');

router.post('/login', auth.optional, (req, res, next) => {
  const {
    body: { email, password },
  } = req;

  if (!email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if (!password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate(
    'local',
    { session: false },
    (err, passportUser, info) => {
      // console.log('route in authenticate : ', err, passportUser, info);
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const user = passportUser;
        user.token = authController.generateJWT(passportUser);

        return res.json({ user: authController.toAuthJSON(user) });
      }

      return res.status(400).json({ errors: info });
    }
  )(req, res, next);
});

router.post('/logout', auth.required, (req, res, next) => {
  req.logout();

  // const {AUTH0_DOMAIN, AUTH0_CLIENT_ID, BASE_URL} = process.env;
  res.redirect(process.env.SERVER_URL);
});

// GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const {
    payload: { id },
  } = req;
  return UserController.getUser(id).then((user) => {
    if (!user) {
      return res.sendStatus(400);
    }
    return res.json({ user: authController.toAuthJSON(user) });
  });
});

module.exports = router;
