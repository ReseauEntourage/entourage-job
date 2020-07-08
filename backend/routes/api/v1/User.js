const validator = require('validator');
const express = require('express');
const {checkCandidatOrCoachAuthorization, checkUserAuthorization} = require('../../../utils');
const {USER_ROLES} = require("../../../../constants");
const { auth } = require('../../../controllers/Auth');
const { sendMail } = require('../../../controllers/mail');

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

  UserController.createUser({ ...req.body, password: hash, salt })
    .then((users) => {
      console.log(
        '# User créé',
        `login : ${req.body.email}`,
        `password: ${userPassword}`
      );
      sendMail({
        toEmail: req.body.email,
        subject: 'Bienvenue chez LinkedOut',
        text:
          'Bonjour,\n' +
          `Tu es maintenant inscrit sur le site LinkedOut. Tu peux accéder à ton espace personnel depuis la plateforme en renseignant ton adresse mail et le mot de passe suivant : ${userPassword}\n` +
          "Depuis cette espace, tu peux rédiger ton CV avec l'aide de ton bénévole-coach et gérer les opportunités que tu reçois.\n" +
          "N'hésite pas à aller changer ton mot de passe directement dans tes paramètres afin d'en créer un facile à retenir pour toi.\n\n" +
          'A bientôt,\n\n' +
          "L'équipe Entourage",
      });

      res.status(200).json(users);
    })
    .catch((err) => {
      console.log(err);
      if(err.name === "SequelizeUniqueConstraintError") {
        res.status(409).send('Adresse email déjà existante');
      }
      else {
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
        console.log(`Users récupérés (Total : ${users.length})`);
        res.status(200).json(users);
      })
      .catch((err) => {
        console.log(err);
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
      console.log(`Users récupérés (Total : ${users.length})`);
      res.status(200).json(
        users.map((u) => {
          const user = u.toJSON();
          // sort by version desc
          if (user.role === USER_ROLES.CANDIDAT && user.candidat.cvs) {
            user.candidat.cvs = user.candidat.cvs.sort(
              (a, b) => b.version - a.version
            );
          }
          return user;
        })
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/user
 * Description : Récupère tous les Users
 */
router.get('/search', auth([USER_ROLES.ADMIN]), (req, res) => {
  UserController.searchUsers(req.query.query, req.query.role)
    .then((users) => {
      console.log(`Users récupérés (Total : ${users.length})`);
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/user/<ID ou EMAIL>
 * Description : Récupère le User associé à l'<ID ou EMAIL> fournit
 */
router.get('/candidat', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), (req, res) => {
  if(req.payload.id === req.query.coachId || req.payload.id === req.query.candidatId || req.payload.role === USER_ROLES.ADMIN) {
    UserController.getUserCandidatOpt(req.query)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(401).send('Une erreur est survenue');
      });
  }
  else {
    res.status(401).send({message: "Unauthorized"});
  }
});

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
          console.error(err);
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
router.get('/:id', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), (req, res) => {
  checkUserAuthorization(req, res, req.params.id, () => {
    (validator.isEmail(req.params.id)
        ? UserController.getUserByEmail(req.params.id)
        : UserController.getUser(req.params.id)
    )
      .then((user) => {
        console.log(`User trouvé`);
        res.status(200).json(user);
      })
      .catch((err) => {
        console.log(`Aucun User trouvé`);
        res.status(401).send(err);
      });
  });
});

/**
 * Route : PUT /api/<VERSION>/user/<ID>
 * Description : Modifie le User associé à l'<ID> fournit
 */
// TODO check
router.put('/change-pwd', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), (req, res) => {
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
            console.log(`User modifié`);
            res.status(200).json(user);
          })
          .catch((err) => {
            console.log(err);
            res.status(401).send(`Une erreur est survenue`);
          });
      } else {
        res.status(401).send('Mot de passe invalide');
      }
    })
    .catch(() => {
      res.status(401).send('Utilisateur inaccessible');
    });
});

/**
 * Route : PUT /api/<VERSION>/user/<ID>
 * Description : Modifie le User associé à l'<ID> fournit
 */
router.put('/candidat/:id', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), (req, res) => {
  checkCandidatOrCoachAuthorization(req, res, req.params.id, () => {
    UserController.setUserCandidat(req.params.id, req.body)
      .then((user) => {
        console.log('Visibilité CV candidat - mise à jour réussie');
        res.status(200).json(user);
      })
      .catch((err) => {
        console.log('Visibilité CV candidat - Erreur mise à jour :');
        console.error(err);
        res.status(400).send('Une erreur est survenue');
      });
  });
});

/**
 * Route : PUT /api/<VERSION>/user/<ID>
 * Description : Modifie le User associé à l'<ID> fournit
 */
router.put('/:id', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), (req, res) => {
  checkUserAuthorization(req, res, req.params.id, () => {

    const setUser = () => {
      UserController.setUser(req.params.id, req.body)
        .then((user) => {
          console.log(`User modifié`);
          res.status(200).json(user);
        })
        .catch((err) => {
          console.log(`Une erreur est survenue`);
          res.status(401).send(err);
        });
    };

    const keys = Object.keys(req.body);
    const authorizedKeys = ['email', 'phone'];

    if(req.payload.role === USER_ROLES.ADMIN) {
      UserController.changeUserRole(req.params.id, req.body).then(() => {
         setUser();
      });
    }
    else if(keys.some((key) => !authorizedKeys.includes(key))) {
      res.status(401).send({message: "Unauthorized"});
    }
    else {
      setUser();
    }
  });
});

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
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

module.exports = router;
