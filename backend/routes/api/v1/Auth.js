const express = require('express');

const router = express.Router();
const passport = require('passport');
const {
  auth
} = require('../../../controllers/Auth');
const {
  sendMail
} = require('../../../controllers/mail');
const AuthController = require('../../../controllers/Auth');
const UserController = require('../../../controllers/User');
const { USER_ROLES } = require('../../../../constants');
const RateLimiter = require('../../../utils/RateLimiter');

const authLimiter = RateLimiter.createLimiter(10);

/**
 * Utilisation d'un "custom callback" pour mieux gérer l'echec d'authentification
 * Source : http://www.passportjs.org/docs/downloads/html/#custom-callback
 */
router.post('/login', authLimiter, auth(), (req, res, next) => {
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
    'local', {
    session: false
  },
    (err, passportUser, info) => {
      if (err) {
        console.log('error while auth')
        return next(err);
      }

      if (passportUser) {
        const user = passportUser;
        user.token = AuthController.generateJWT(passportUser);

        return res.json({
          user: AuthController.toAuthJSON(user)
        });
      }

      return res.status(400).json({
        error: info.error
      });
    }
  )(req, res, next);
});

router.post('/logout', authLimiter, auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), (req, res /* , next */) => {
  req.logout();

  // const {AUTH0_DOMAIN, AUTH0_CLIENT_ID, BASE_URL} = process.env;
  res.redirect(process.env.SERVER_URL);
});

router.post('/forgot', authLimiter, auth(), (req, res /* , next */) => {
  let token = null;
  let user = null;
  const {
    email
  } = req.body;
  console.log(
    `Demande de réinitialisation du mot de passe du compte : ${email}`
  );
  if (!email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }
  return UserController.getUserByEmail(email)
    .then((userFound) => {
      user = userFound;

      if (!user) {
        console.log(`Aucun user rattaché à l'adresse mail suivante : ${email}`);
        return false;
      }

      console.log(
        `Demande de réinitialisation du mot de passe : user.id = ${user.id}`
      );

      const endDate = Date.now() + 1000 * 60 * 60 * 24;
      token = AuthController.generateJWT(user, endDate);
      const {
        hash,
        salt
      } = AuthController.encryptPassword(token);
      return UserController.setUser(user.id, {
        hashReset: hash,
        saltReset: salt,
      });
    })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send(`Utilisateur inexistant`);
      }
      console.log('sending email');
      // Envoi du mail
      sendMail({
        toEmail: user.email,
        subject: 'Réinitialisation mot de passe',
        text: 'Bonjour,\n\n' +
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

/**
 * GET Vérification lien de réinitialisation mot de passe
 */
router.get('/reset/:userId/:token', authLimiter, auth(), (req, res /* , next */) => {
  const infoLog = 'GET /reset/:userId/:token -';

  const {
    userId,
    token
  } = req.params;
  console.log(
    `${infoLog} Vérification du lien de réinitialisation de mot de passe`
  );
  console.log(`${infoLog} userId : ${userId} , token : ${token}`);

  UserController.getCompleteUser(userId)
    .then((userFound) => {
      const user = userFound;

      if (!user) {
        console.log(
          `${infoLog} Aucun user rattaché à l'id fournit : ${userId}`
        );
        return res.status(403).send({
          error: 'Lien non valide'
        });
      }
      /* console.log(`${infoLog} DEBUG :`);
      console.log(user); */
      if (
        !AuthController.validatePassword(token, user.hashReset, user.saltReset)
      ) {
        console.log(` ${infoLog} Token invalide`);
        return res.status(403).send({
          error: 'Lien non valide'
        });
      }
      return res.status(200).send('Lien valide');
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).send(`Une erreur est survenue`);
    });
});

/**
 * POST Réinitialisation mot de passe
 */
router.post('/reset/:userId/:token', authLimiter, auth(), (req, res /* , next */) => {
  const infoLog = 'POST /reset/:userId/:token -';
  const {
    userId,
    token
  } = req.params;
  const {
    newPassword,
    confirmPassword
  } = req.body;
  console.log(
    `${infoLog} Vérification du lien de réinitialisation de mot de passe`
  );
  console.log(`${infoLog} userId : ${userId} , token : ${token}`);

  UserController.getCompleteUser(userId)
    .then((userFound) => {
      console.log('USER FOUND', userFound);
      const user = userFound;
      if (!user) {
        console.log(
          `${infoLog} Aucun user rattaché à l'id fournit : ${userId}`
        );
        return res.status(403).send({
          error: 'Lien non valide'
        });
      }
      /* console.log(`${infoLog} DEBUG :`);
      console.log(user); */
      if (
        !AuthController.validatePassword(token, user.hashReset, user.saltReset)
      ) {
        console.log(`${infoLog} Token invalide`);
        return res.status(403).send({
          error: 'Lien non valide'
        });
      }
      console.log(`${infoLog} Lien valide`);
      if (newPassword !== confirmPassword) {
        console.log(
          `${infoLog} La confirmation de mot de passe est incorrecte`
        );
        return res
          .status(400)
          .send({
            error: `La confirmation du mot de passe est incorrecte`
          });
      }
      console.log(`${infoLog} Les 2 mots de passe sont valides`);
      console.log(`${infoLog} Chiffrement du nouveau mot de passe`);
      const {
        hash,
        salt
      } = AuthController.encryptPassword(newPassword);
      console.log(`${infoLog} Mise à jour du mot de passe de l'utilisateur`);
      return UserController.setUser(user.id, {
        password: hash,
        salt,
        hashReset: null,
        saltReset: null,
      });
    })
    .then((userUpdated) => {
      if (userUpdated) {
        console.log(`${infoLog} Mise à jour réussie`);
        return res.status(200).json(userUpdated);
      }
      return res.status(401).send(`Une erreur inconnue est survenue`);
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).send(`Une erreur est survenue`);
    });
});

/**
 * GET current route (required, only authenticated users have access)
 */
router.get('/current', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), async (req,
  res /* , next */) => {
  const {
    payload: {
      id
    },
  } = req;
  const user = await UserController.getUser(id);
  if (!user) {
    return res.sendStatus(400);
  }
  UserController.setUser(id, { lastConnection: Date.now() }).then((updatedUser) => {
    if (!updatedUser) {
      return res.status(401).send(`Utilisateur inexistant`);
    }
    return res.json({ user: AuthController.toAuthJSON(user) });
  }).catch((err) => {
    return res.status(401).send(`Une erreur est survenue`);
  })
});

module.exports = router;
