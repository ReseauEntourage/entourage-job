import * as AuthController from 'src/controllers/Auth';
import { auth, generateRandomPasswordInJWT } from 'src/controllers/Auth';
import * as UserController from 'src/controllers/User';
import { JOBS, MAILJET_TEMPLATES, REDIS_KEYS, USER_ROLES } from 'src/constants';
import RateLimiter from 'src/utils/RateLimiter';

import { addToWorkQueue } from 'src/jobs';
import { logger } from 'src/utils/Logger';
import _ from 'lodash';
import express from 'express';
import { passwordStrength } from 'check-password-strength';
import { getAdminMailsFromZone } from 'src/utils/Finding';

const router = express.Router();

const authLimiter = RateLimiter.createLimiter(REDIS_KEYS.RL_AUTH, 10);

const isValidResetToken = (hashReset, saltReset, token) => {
  const decodedToken = AuthController.decodeJWT(token);

  return (
    hashReset &&
    saltReset &&
    decodedToken &&
    AuthController.validatePassword(decodedToken.password, hashReset, saltReset)
  );
};

/**
 * Utilisation d'un "custom callback" pour mieux gérer l'echec d'authentification
 * Source : http://www.passportjs.org/docs/downloads/html/#custom-callback
 */
router.post('/login', authLimiter, auth(), (req, res) => {
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

  return UserController.getUserByEmail(email)
    .then((user) => {
      if (
        !user ||
        !AuthController.validatePassword(
          password,
          user.dataValues.password,
          user.dataValues.salt
        )
      ) {
        return res
          .status(400)
          .send("L'adresse email ou le mot de passe est invalide");
      }
      return res.status(200).json({
        user: AuthController.toAuthJSON(user),
      });
    })
    .catch((err) => {
      logger(res).error(err);
      return res.status(401).send(err);
    });
});

router.post(
  '/logout',
  authLimiter,
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res /* , next */) => {
    // const {AUTH0_DOMAIN, AUTH0_CLIENT_ID, BASE_URL} = process.env;
    res.redirect(process.env.FRONT_URL);
  }
);

router.post('/forgot', authLimiter, auth(), async (req, res /* , next */) => {
  try {
    const { email } = req.body;
    logger(res).log(
      `Demande de réinitialisation du mot de passe du compte : ${email}`
    );

    if (!email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }
    const user = await UserController.getUserByEmail(email);

    if (!user) {
      logger(res).log(
        `Aucun user rattaché à l'adresse mail suivante : ${email}`
      );
      return res.status(404).send(`Utilisateur inexistant`);
    }

    logger(res).log(
      `Demande de réinitialisation du mot de passe : user.id = ${user.id}`
    );
    const {
      hash: hashReset,
      salt: saltReset,
      jwtToken,
    } = generateRandomPasswordInJWT();

    const updatedUser = await UserController.setUser(user.id, {
      hashReset,
      saltReset,
    });

    if (updatedUser) {
      logger(res).log('sending email');

      const { id, firstName, role, zone } = updatedUser.toJSON();

      const { candidatesAdminMail } = getAdminMailsFromZone(zone);

      // Envoi du mail
      await addToWorkQueue({
        type: JOBS.JOB_TYPES.SEND_MAIL,
        toEmail: user.email,
        templateId: MAILJET_TEMPLATES.PASSWORD_RESET,
        replyTo: candidatesAdminMail,
        variables: _.omitBy(
          {
            id,
            firstName,
            role,
            zone,
            token: jwtToken,
          },
          _.isNil
        ),
      });

      return res.status(200).send('Demande envoyée');
    }
    return res.status(404).send(`Utilisateur inexistant`);
  } catch (err) {
    logger(res).error(err);
    return res.status(401).send(err);
  }
});

/**
 * GET Vérification lien de réinitialisation mot de passe
 */
router.get(
  '/reset/:userId/:token',
  authLimiter,
  auth(),
  async (req, res /* , next */) => {
    try {
      const infoLog = 'GET /reset/:userId/:token -';

      const { userId, token } = req.params;
      logger(res).log(
        `${infoLog} Vérification du lien de réinitialisation de mot de passe`
      );
      logger(res).log(`${infoLog} userId : ${userId} , token : ${token}`);

      const user = await UserController.getCompleteUser(userId);

      if (!user) {
        logger(res).log(
          `${infoLog} Aucun user rattaché à l'id fournit : ${userId}`
        );
        return res.status(403).send({
          error: 'Lien non valide',
        });
      }

      const { hashReset, saltReset } = user;

      if (!isValidResetToken(hashReset, saltReset, token)) {
        logger(res).error(` ${infoLog} Token invalide`);
        return res.status(403).send({
          error: 'Lien non valide',
        });
      }

      return res.status(200).send('Lien valide');
    } catch (err) {
      logger(res).log(err);
      return res.status(401).send(err);
    }
  }
);

/**
 * POST Réinitialisation mot de passe
 */
router.post(
  '/reset/:userId/:token',
  authLimiter,
  auth(),
  async (req, res /* , next */) => {
    try {
      const infoLog = 'POST /reset/:userId/:token -';
      const { userId, token } = req.params;
      const { newPassword, confirmPassword } = req.body;
      logger(res).log(
        `${infoLog} Vérification du lien de réinitialisation de mot de passe`
      );
      logger(res).log(`${infoLog} userId : ${userId} , token : ${token}`);

      const user = await UserController.getCompleteUser(userId);
      if (!user) {
        logger(res).error(
          `${infoLog} Aucun user rattaché à l'id fournit : ${userId}`
        );
        return res.status(403).send({
          error: 'Lien non valide',
        });
      }

      const { hashReset, saltReset } = user;

      if (!isValidResetToken(hashReset, saltReset, token)) {
        logger(res).error(` ${infoLog} Token invalide`);
        return res.status(403).send({
          error: 'Lien non valide',
        });
      }

      logger(res).log(`${infoLog} Lien valide`);

      if (newPassword !== confirmPassword) {
        logger(res).error(
          `${infoLog} La confirmation de mot de passe est incorrecte`
        );
        return res.status(400).send({
          error: `La confirmation du mot de passe est incorrecte`,
        });
      }

      logger(res).log(`${infoLog} Les 2 mots de passe sont valides`);

      if (passwordStrength(newPassword).id < 2) {
        logger(res).error(
          `${infoLog} La sécurité du mot de passe est trop faible`
        );
        return res.status(400).send({
          error: `La sécurité du mot de passe est trop faible`,
        });
      }
      logger(res).log(`${infoLog} Chiffrement du nouveau mot de passe`);

      const { hash, salt } = AuthController.encryptPassword(newPassword);

      logger(res).log(
        `${infoLog} Mise à jour du mot de passe de l'utilisateur`
      );
      const userUpdated = await UserController.setUser(user.id, {
        password: hash,
        salt,
        hashReset: null,
        saltReset: null,
      });

      if (userUpdated) {
        logger(res).log(`${infoLog} Mise à jour réussie`);
        return res.status(200).json(userUpdated);
      }

      logger(res).error(`${infoLog} Erreur de réinitialisation`);
      return res.status(401).send(`Une erreur inconnue est survenue`);
    } catch (err) {
      logger(res).error(err);
      return res.status(401).send(err);
    }
  }
);

/**
 * GET current route (required, only authenticated users have access)
 */
router.get(
  '/current',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  async (req, res /* , next */) => {
    const {
      payload: { id },
    } = req;
    const user = await UserController.getUser(id);
    if (!user) {
      return res.sendStatus(400);
    }
    UserController.setUser(id, { lastConnection: Date.now() })
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(401).send(`Utilisateur inexistant`);
        }
        return res.json({ user: AuthController.toAuthJSON(user) });
      })
      .catch((err) => {
        logger(res).error(err);
        return res.status(401).send(err);
      });
  }
);

export default router;
