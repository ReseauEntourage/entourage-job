const express = require('express');

const router = express.Router();
const passport = require('passport');
const { auth } = require('../../../controllers/Auth');
const { sendMail } = require('../../../controllers/mail');
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

router.post('/forgot', (req, res, next) => {
  let token = null;
  let user = null;
  const { email } = req.body;
  console.log(email);

  if (!email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }
  UserController.getUserByEmail(email)
    .then((userFound) => {
      user = userFound;
      console.log(
        `Demande de réinitialisation du mot de passe demandée par user.id = ${user.id}`
      );
      if (!user) {
        return res.status(200).send('Demande envoyée');
      }
      const endDate = Date.now() + 1000 * 60 * 60 * 24;
      token = AuthController.generateJWT(user, endDate);
      console.log(token);
      const { hash, salt } = AuthController.encryptPassword(token);
      console.log(hash);
      console.log(salt);
      return UserController.setUser(user.id, {
        hashReset: hash,
        saltReset: salt,
      });
    })
    .then((nbUpdate) => {
      console.log(`Nombre de User mis à jour : ${nbUpdate}`);
      if (!nbUpdate[0]) {
        return res.status(401).send(`Une erreur est survenue`);
      }
      // Envoi du mail
      sendMail({
        toEmail: user.email,
        subject: 'Réinitialisation mot de passe',
        text:
          'Bonjour,\n\n' +
          'Pour réinitialiser votre mot de passe, cliquer ici sur ce lien : \n' +
          `${process.env.SERVER_URL}/reset/${user.id}/${token}\n\n` +
          'Cordialement,\n\n' +
          `L'équipe LinkedOut`,
      });
      return res.status(200).send('Demande envoyée');
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).send(`Une erreur est survenue`);
    });
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
