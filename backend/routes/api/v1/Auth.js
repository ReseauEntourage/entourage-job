const express = require('express');

const router = express.Router();
const passport = require('passport');
const { auth } = require('../../../controllers/Auth');
const AuthController = require('../../../controllers/Auth');
const UserController = require('../../../controllers/User');

/**
 * Utilisation d'un "custom callback" pour mieux gérer l'echec d'authentification
 * Source : http://www.passportjs.org/docs/downloads/html/#custom-callback
 */
router.post('/login', auth.optional, (req, res, next) => {
  const { email, password } = req.body;

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
        user.token = AuthController.generateJWT(passportUser);

        return res.json({ user: AuthController.toAuthJSON(user) });
      }

      return res.status(400).json({ error: info.error });
    }
  )(req, res, next);
});

router.post('/logout', auth.required, (req, res, next) => {
  req.logout();

  // const {AUTH0_DOMAIN, AUTH0_CLIENT_ID, BASE_URL} = process.env;
  res.redirect(process.env.SERVER_URL);
});

// GET current route (required, only authenticated users have access)
router.get('/current', auth.required, async (req, res, next) => {
  const {
    payload: { id },
  } = req;
  const user = await UserController.getUser(id);
  if (!user) {
    return res.sendStatus(400);
  }
  UserController.setUser(id, { lastConnection: Date.now() });
  return res.json({ user: AuthController.toAuthJSON(user) });
});

module.exports = router;
