const validator = require('validator');
const express = require('express');
const { addToWorkQueue } = require('../../../jobs');
const {
  checkCandidatOrCoachAuthorization,
  checkUserAuthorization,
} = require('../../../utils');
const { USER_ROLES, JOBS } = require('../../../../constants');
const { auth } = require('../../../controllers/Auth');
const { logger } = require('../../../utils/Logger');

const router = express.Router();
const UserController = require('../../../controllers/User');
const AuthController = require('../../../controllers/Auth');

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
    .then(async (users) => {
      await addToWorkQueue({
        type: JOBS.JOB_TYPES.SEND_MAIL,
        toEmail: req.body.email,
        subject: 'Bienvenue chez LinkedOut',
        html:
          'Bonjour,<br /><br />' +
          `Vous êtes maintenant inscrit sur le site LinkedOut. Vous pouvez accéder à votre espace personnel depuis la plateforme en renseignant votre adresse mail et le mot de passe suivant : <strong>${userPassword}</strong><br /><br />` +
          "Depuis cette espace, vous pouvez rédiger votre CV avec l'aide de votre bénévole-coach et gérer les opportunités que vous recevez.<br /><br />" +
          "N'hésitez pas à aller changer votre mot de passe directement dans vos paramètres afin d'en créer un facile à retenir pour vous.<br /><br />" +
          'A bientôt,<br /><br />' +
          "L'équipe Entourage",
      });

      res.status(200).json(users);
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
 * Route : GET /api/<VERSION>/user
 * Description : Récupère tous les Users
 */
router.get('/members', auth([USER_ROLES.ADMIN]), (req, res) => {
  const order = [['firstName', 'ASC']];
  UserController.getMembers(
    req.query.limit,
    req.query.offset,
    order,
    req.query.role,
    req.query.query
  )
    .then((users) => {
      logger(res).log(`Users récupérés (Total : ${users.length})`);
      res.status(200).json(
        users.map((u) => {
          const user = u.toJSON();
          // sort by version desc
          if (
            user.role === USER_ROLES.CANDIDAT &&
            user.candidat &&
            user.candidat.cvs
          ) {
            user.candidat.cvs = user.candidat.cvs.sort((a, b) => {
              return b.version - a.version;
            });
          }
          return user;
        })
      );
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
      UserController.setUserCandidat(req.params.id, req.body)
        .then((user) => {
          logger(res).log('Visibilité CV candidat - mise à jour réussie');
          res.status(200).json(user);
        })
        .catch((err) => {
          logger(res).log('Visibilité CV candidat - Erreur mise à jour :');
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

module.exports = router;
