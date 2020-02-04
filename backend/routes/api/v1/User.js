const validator = require('validator');
const express = require('express');
const { auth } = require('../../../controllers/Auth');

const router = express.Router();
const UserController = require('../../../controllers/User');
const AuthController = require('../../../controllers/Auth');

/**
 * Route : GET /api/<VERSION>/user
 * Description : Récupère tous les Users
 */
router.get('/', (req, res) => {
  UserController.getUsers()
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
 * Route : POST /api/<VERSION>/user
 * Description : Créé le User
 */
router.post('/', (req, res) => {
  const newUser = req.body;
  const objPassword = AuthController.encryptPassword(newUser.password);
  newUser.password = objPassword.hash;
  newUser.salt = objPassword.salt;
  UserController.createUser(newUser)
    .then((users) => {
      console.log(`User créé`);
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
router.get('/:identifier', (req, res) => {
  let getUser;
  if (validator.isEmail(req.params.identifier)) {
    getUser = UserController.getUserByEmail(req.params.identifier);
  } else {
    getUser = UserController.getUser(req.params.identifier);
  }
  getUser
    .then((user) => {
      console.log(`User trouvé`);
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(`Aucun User trouvé`);
      res.status(401).send(err);
    });
});

/**
 * Route : PUT /api/<VERSION>/user/<ID>
 * Description : Modifie le User associé à l'<ID> fournit
 */
router.put('/change-pwd', auth.required, (req, res) => {
  UserController.getUser(req.payload.id)
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
router.put('/:id', (req, res) => {
  UserController.setUser(req.params.id, req.body)
    .then((user) => {
      console.log(`User modifié`);
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(`Une erreur est survenue`);
      res.status(401).send(err);
    });
});

/**
 * Route : DELETE /api/<VERSION>/user/<ID>
 * Description : Supprime le User correspondant à l'<id> fournit dans l'URL.
 * Paramètre :
 * - id : ID du User à supprimer
 * Exemple : <server_url>/api/v1/user/27272727-aaaa-bbbb-cccc-012345678927
 */
router.delete('/:id', (req, res) => {
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
