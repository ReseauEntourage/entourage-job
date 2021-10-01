import { addToWorkQueue } from 'src/backend/jobs';
import { USER_ROLES, JOBS } from 'src/constants';
import * as AuthController from 'src/backend/controllers/Auth';
import { auth } from 'src/backend/controllers/Auth';
import * as UserController from 'src/backend/controllers/User';
import { logger } from 'src/backend/utils/Logger';

import validator from 'validator';
import express from 'express';

import {
  checkCandidatOrCoachAuthorization,
  checkUserAuthorization,
} from 'src/backend/utils';

const router = express.Router();

/**
 * Route : POST /api/<VERSION>/user
 * Description : Créé le User
 */
router.post('/', auth([USER_ROLES.ADMIN]), (req, res) => {
  function fakePassword() {
    return Math.random() // Generate random number, eg: 0.123456
      .toString(36) // Convert  to base-36 : "0.4fzyo82mvyr"
      .slice(-8); // Cut off last 8 characters : "yo82mvyr"
  }

  const userPassword = req.body.password || fakePassword();
  const { hash, salt } = AuthController.encryptPassword(userPassword);

  UserController.createUser({
    ...req.body,
    password: hash,
    salt,
  })
    .then(async (user) => {
      if (user.role === USER_ROLES.ADMIN) {
        await addToWorkQueue({
          type: JOBS.JOB_TYPES.SEND_MAIL,
          toEmail: req.body.email,
          subject: 'Bienvenue chez LinkedOut',
          html:
            'Bonjour,<br /><br />' +
            `Vous êtes maintenant inscrit${
              user.gender === 0 ? '' : 'e'
            } sur le site LinkedOut en tant qu'administrateur. Vous pouvez accéder à <a href="${
              process.env.SERVER_URL
            }/login">votre espace personnel depuis la plateforme</a> en renseignant votre adresse mail et le mot de passe suivant : <strong>${userPassword}</strong><br /><br />` +
            "N'hésitez pas à aller changer votre mot de passe directement dans vos paramètres.<br /><br />" +
            `À tout moment, retrouvez votre espace personnel en ajoutant ce lien à vos favoris, ou bien en consultant le site <a href="${process.env.SERVER_URL}">LinkedOut</a> puis en cliquant sur le bouton "Se connecter" situé tout en bas de chaque page.<br /><br />` +
            'A bientôt,<br /><br />' +
            "L'équipe LinkedOut",
        });
      } else {
        await addToWorkQueue({
          type: JOBS.JOB_TYPES.SEND_MAIL,
          toEmail: req.body.email,
          subject: 'Bienvenue chez LinkedOut',
          html:
            'Bonjour,<br /><br />' +
            `Vous êtes maintenant inscrit${
              user.gender === 0 ? '' : 'e'
            } sur le site LinkedOut. Vous pouvez accéder à <a href="${
              process.env.SERVER_URL
            }/login">votre espace personnel depuis la plateforme</a> en renseignant votre adresse mail et le mot de passe suivant : <strong>${userPassword}</strong><br /><br />` +
            `Depuis cet espace, vous pouvez ${
              user.role === USER_ROLES.CANDIDAT
                ? "rédiger votre CV avec l'aide de votre coach LinkedOut et avoir accès à des offres d’emploi"
                : 'accompagner votre Candidat dans la rédaction de son CV et gérer ensemble les opportunités qu’il reçoit'
            }.<br /><br />` +
            "N'hésitez pas à aller changer votre mot de passe directement dans vos paramètres.<br /><br />" +
            `À tout moment, retrouvez votre espace personnel en ajoutant ce lien à vos favoris, ou bien en consultant le site <a href="${process.env.SERVER_URL}">LinkedOut</a> puis en cliquant sur le bouton "Se connecter" situé tout en bas de chaque page.<br /><br />` +
            'A bientôt,<br /><br />' +
            "L'équipe LinkedOut<br/><br/>" +
            `Un souci de connexion ? Une question ? Contactez-nous !<br/>` +
            `<ul><li><strong>Paris :</strong> Inès (07 82 44 97 39 / ines@entourage.social) / Jeanne (07 67 32 53 63 / jeanne@entourage.social)</li>` +
            `<li><strong>Lille :</strong> Marie (07 83 85 48 95 / marie.lasne@entourage.social)</li>` +
            `<li><strong>Lyon :</strong> Gabriella (07 67 35 05 86 / gabriella@entourage.social)</li></ul>`,
        });
      }

      res.status(200).json(user);
    })
    .catch((err) => {
      logger(res).error(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(409).send('Adresse email déjà existante');
      } else {
        res.status(401).send('Une erreur est survenue');
      }
    });
});

/**
 * Route : GET /api/<VERSION>/user
 * Description : Récupère tous les Users
 * Disabled because not used
 */

/*
  router.get('/', auth([USER_ROLES.ADMIN]), (req, res) => {
    const order = [['firstName', 'ASC']];
    UserController.getUsers(req.query.limit, req.query.offset, order)
      .then((users) => {
        logger(res).log(`Users récupérés (Total : ${users.length})`);
        res.status(200).json(users);
      })
      .catch((err) => {
        logger(res).error(err);
        res.status(401).send('Une erreur est survenue');
      });
  });
*/

/**
 * Route : GET /api/<VERSION>/user/members
 * Description : Récupère tous les Users
 */
router.get('/members', auth([USER_ROLES.ADMIN]), (req, res) => {
  const order = [['firstName', 'ASC']];
  UserController.getMembers({
    ...req.query,
    order,
  })
    .then((users) => {
      logger(res).log(`Users récupérés (Total : ${users.length})`);
      res.status(200).json(users);
    })
    .catch((err) => {
      logger(res).error(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/user/members/count
 * Description : Compte les membres ayant soumis leur CVs
 */
router.get('/members/count', auth([USER_ROLES.ADMIN]), (req, res) => {
  UserController.countSubmittedCVMembers(req.payload.zone)
    .then((membersCount) => {
      res.status(200).json(membersCount);
    })
    .catch((err) => {
      logger(res).error(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/search
 * Description : Rechercher parmis les users
 */
router.get('/search/candidates', auth(), (req, res) => {
  UserController.searchCandidates(req.query.query)
    .then((users) => {
      logger(res).log(`Candidats récupérés (Total : ${users.length})`);
      res.status(200).json(users);
    })
    .catch((err) => {
      logger(res).error(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/search
 * Description : Rechercher parmis les users
 */
router.get('/search', auth([USER_ROLES.ADMIN]), (req, res) => {
  UserController.searchUsers(req.query.query, req.query.role)
    .then((users) => {
      logger(res).log(`Users récupérés (Total : ${users.length})`);
      res.status(200).json(users);
    })
    .catch((err) => {
      logger(res).error(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/user/<ID ou EMAIL>
 * Description : Récupère le User associé à l'<ID ou EMAIL> fournit
 */
router.get(
  '/candidat',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    if (
      req.payload.id === req.query.coachId ||
      req.payload.id === req.query.candidatId ||
      req.payload.role === USER_ROLES.ADMIN
    ) {
      UserController.getUserCandidatOpt(req.query)
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => {
          logger(res).error(err);
          res.status(401).send('Une erreur est survenue');
        });
    } else {
      res.status(401).send({
        message: 'Unauthorized',
      });
    }
  }
);

/**
 * Route : GET /api/<VERSION>/user/<ID ou EMAIL>
 * Description : Récupère le User associé à l'<ID ou EMAIL> fournit
 */

/*
  router.get('/candidat/:id', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), (req, res) => {
    if(req.payload.id === req.params.id || req.payload.role === USER_ROLES.ADMIN) {
      UserController.getUserCandidat(req.params.id)
        .then((user) => {
          res.status(200).json(user);
        })
        .catch((err) => {
          logger(res).error(err);
          res.status(401).send('Une erreur est survenue');
        });
    }
    else {
      res.status(401).send({message: "Unauthorized"});
    }
  });
*/

/**
 * Route : GET /api/<VERSION>/user/<ID ou EMAIL>
 * Description : Récupère le User associé à l'<ID ou EMAIL> fournit
 */
router.get(
  '/:id',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    checkUserAuthorization(req, res, req.params.id, () => {
      const functionToCall = validator.isEmail(req.params.id)
        ? UserController.getUserByEmail
        : UserController.getUser;

      functionToCall(req.params.id)
        .then((user) => {
          if (!user) {
            res.status(401).send(`Utilisateur inexistant`);
          } else {
            logger(res).log(`User trouvé`);
            res.status(200).json(user);
          }
        })
        .catch((err) => {
          logger(res).error(`Aucun User trouvé`);
          res.status(404).send(err);
        });
    });
  }
);

/**
 * Route : PUT /api/<VERSION>/user/<ID>
 * Description : Modifie le User associé à l'<ID> fournit
 */
// TODO check
router.put(
  '/change-pwd',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    UserController.getUserByEmail(req.payload.email)
      .then(({ salt: oldSalt, password }) => {
        const validated = AuthController.validatePassword(
          req.body.oldPassword,
          password,
          oldSalt
        );
        if (validated) {
          const { hash, salt } = AuthController.encryptPassword(
            req.body.newPassword
          );
          UserController.setUser(req.payload.id, {
            password: hash,
            salt,
          })
            .then((user) => {
              if (!user) {
                res.status(401).send(`Utilisateur inexistant`);
              }
              logger(res).log(`User modifié`);
              res.status(200).json(user);
            })
            .catch((err) => {
              logger(res).error(err);
              res.status(401).send(`Une erreur est survenue`);
            });
        } else {
          res.status(401).send('Mot de passe invalide');
        }
      })
      .catch(() => {
        res.status(401).send('Utilisateur inaccessible');
      });
  }
);

/**
 * Route : PUT /api/<VERSION>/user/candidat/<ID>
 * Description : Modifie le User associé à l'<ID> fournit
 */
router.put(
  '/candidat/:id',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    checkCandidatOrCoachAuthorization(req, res, req.params.id, () => {
      UserController.setUserCandidat(req.params.id, req.body, req.payload.id)
        .then((user) => {
          logger(res).log('User candidat - mise à jour réussie');
          res.status(200).json(user);
        })
        .catch((err) => {
          logger(res).log('User_Candidat - Erreur mise à jour :');
          logger(res).error(err);
          res.status(400).send('Une erreur est survenue');
        });
    });
  }
);

/**
 * Route : GET /api/<VERSION>/user/checkUpdate
 * Description : Vérifie si des modifications ont étés apportés à la note de suivi
 */
router.get(
  '/candidat/checkUpdate',
  auth([USER_ROLES.COACH, USER_ROLES.CANDIDAT]),
  (req, res) => {
    let candidatId;
    if (req.payload.role === USER_ROLES.CANDIDAT) {
      candidatId = req.payload.id;
    } else if (req.payload.candidatId) {
      candidatId = req.payload.candidatId;
    }
    UserController.checkNoteHasBeenModified(candidatId, req.payload.id)
      .then((noteHasBeenModified) => {
        res.status(200).json(noteHasBeenModified);
      })
      .catch((err) => {
        logger(res).error(err);
        res.status(401).send('Une erreur est survenue');
      });
  }
);

/**
 * Route : PUT /api/<VERSION>/user/candidat/read/<ID>
 * Description : Reset le lastModifiedBy du User associé à l'<ID> fournit
 */
router.put(
  '/candidat/read/:id',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    checkCandidatOrCoachAuthorization(req, res, req.params.id, () => {
      UserController.setNoteHasBeenRead(req.params.id, req.payload.id)
        .then((userCandidat) => {
          res.status(200).json(userCandidat);
        })
        .catch((err) => {
          logger(res).error(err);
          res.status(400).send('Une erreur est survenue');
        });
    });
  }
);

/**
 * Route : PUT /api/<VERSION>/user/<ID>
 * Description : Modifie le User associé à l'<ID> fournit
 */
router.put(
  '/:id',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    checkCandidatOrCoachAuthorization(req, res, req.params.id, () => {
      const keys = Object.keys(req.body);
      const authorizedKeys = ['email', 'phone', 'address'];

      if (
        req.payload.role === USER_ROLES.ADMIN ||
        !keys.some((key) => {
          return !authorizedKeys.includes(key);
        })
      ) {
        UserController.setUser(req.params.id, req.body)
          .then((updatedUser) => {
            if (!updatedUser) {
              res.status(401).send(`Utilisateur inexistant`);
            } else {
              logger(res).log(`User modifié`);
              res.status(200).json(updatedUser);
            }
          })
          .catch((err) => {
            logger(res).error(`Une erreur est survenue`);
            res.status(401).send(err);
          });
      } else {
        res.status(401).send({ message: 'Unauthorized' });
      }
    });
  }
);

/**
 * Route : DELETE /api/<VERSION>/user/<ID>
 * Description : Supprime le User correspondant à l'<id> fournit dans l'URL.
 * Paramètre :
 * - id : ID du User à supprimer
 * Exemple : <server_url>/api/v1/user/27272727-aaaa-bbbb-cccc-012345678927
 */
router.delete('/:id', auth([USER_ROLES.ADMIN]), (req, res) => {
  UserController.deleteUser(req.params.id)
    .then((result) => {
      if (!result) {
        res.status(401).send(`Utilisateur inexistant`);
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      logger(res).error(err);
      res.status(401).send('Une erreur est survenue');
    });
});

export default router;
