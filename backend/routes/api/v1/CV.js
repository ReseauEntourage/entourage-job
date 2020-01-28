// eslint-disable-next-line import/newline-after-import
const express = require('express');
const router = express.Router();
const { auth } = require('../../../controllers/Auth');
const CVController = require('../../../controllers/CV');
const generateCVPreview = require('../../../shareImage');

/**
 * Route : GET /api/<VERSION>/cv
 * Description : Récupère tous les CVs complets
 */
router.get('/', (req, res) => {
  CVController.getCVs()
    .then((listeCVs) => {
      console.log(`CVs récupérés (Total : ${listeCVs.length}`);
      res.status(200).json(listeCVs);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : POST /api/<VERSION>/cv
 * Description : Créé le CV
 */
router.post('/', (req, res) => {
  CVController.createCV(req.body)
    .then((cv) => {
      // creation de l'image de preview cv
      // console.log(req.body);
      generateCVPreview(
        cv.user.firstName.toUpperCase(),
        "A besoin d'un coup de pouce pour travailler dans...",
        /* cvCreated.ambitions.length > 0
          ? cvCreated.ambitions.join('. ').toUpperCase()
          :  */ '',
        `../../../../static/img/arthur.png`,
        `../../../../static/img/${cv.user.firstName}-preview.jpg`
      )
        .then((resu) => console.log(resu))
        .catch((err) => console.log(err));
      return res.status(200).json(cv);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send(`Une erreur est survenue`);
    });
});

/**
 * Route : GET /api/<VERSION>/cv/edit
 * Description : Récupère le CV associé au <USERID> fournit en body
 */
router.get('/edit', auth.required, (req, res) => {
  console.log(req.payload);
  let userId;
  if (req.payload.role === 'Candidat') {
    userId = req.payload.id;
  } else if (req.payload.userToCoach) {
    userId = req.payload.userToCoach;
  }
  if (!userId) {
    console.log(`Aucun userId trouvé, aucun CV ne peut être récupéré`);
    res.status(401).send('Aucun userId trouvé, aucun CV ne peut être récupéré');
  } else {
    CVController.getCVbyUserId(userId)
      .then((cv) => {
        if (cv !== null) {
          console.log(`CV trouvé`);
        } else {
          console.log(`Aucun CV trouvé`);
        }
        res.status(200).json(cv);
      })
      .catch((err) => {
        console.log(`Aucun CV trouvé`);
        res.status(401).send(err);
      });
  }
});

/**
 * Route : GET /api/<VERSION>/cv/visibility
 * Description : Retourne l'état actuel d'affichage du CV sur le site
 */
router.get('/visibility', auth.required, (req, res) => {
  if (!req.payload.id) {
    console.log(`Profil non connecté, action non autorisé`);
    res.status(401).send('Profil non connecté, action non autorisé');
  } else {
    CVController.getVisibility(req.payload.id)
      .then((status) => {
        if (status !== null) {
          console.log(`Etat actuel à retourner : ${status}`);
        } else {
          console.log(`Impossible d'obtenir un état`);
        }
        res.status(200).json(status);
      })
      .catch((err) => {
        console.log(err);
        res.status(401).send(err);
      });
  }
});

/**
 * Route : PUT /api/<VERSION>/cv/visibility
 * Description : Modifie la visibilité du CV publié sur le site
 */
router.put('/visibility', auth.required, (req, res) => {
  if (!req.payload.id) {
    console.log(`Profil non connecté, action non autorisé`);
    res.status(401).send('Profil non connecté, action non autorisé');
  } else {
    CVController.setVisibility(req.payload.id, req.body)
      .then((status) => {
        if (status !== null) {
          console.log(`Etat modifié à retourner : ${status}`);
        } else {
          console.log(`Impossible d'obtenir un état`);
        }
        res.status(200).json(status);
      })
      .catch((err) => {
        console.log(err);
        res.status(401).send(err);
      });
  }
});

/**
 * Route : GET /api/<VERSION>/cv/<URL>
 * Description : Récupère le CV associé à l'<URL> fournit
 */
router.get('/:url', (req, res) => {
  CVController.getCVbyUrl(req.params.url)
    .then((cv) => {
      if (cv) {
        console.log(`CV trouvé`);
        res.status(200).json(cv);
      } else {
        console.log(`Aucun CV trouvé`);
        res.status(204).send(null);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send(err);
    });
});

/**
 * Route : PUT /api/<VERSION>/cv/<ID>
 * Description : Modifie le CV associé à l'<ID> fournit
 */
router.put('/:id', (req, res) => {
  CVController.setCV(req.params.id, req.body)
    .then((cv) => {
      console.log(`CV modifié`);
      res.status(200).json(cv);
    })
    .catch((err) => {
      console.log(`Une erreur est survenue`);
      res.status(401).send(err);
    });
});

/**
 * Route : GET /api/<VERSION>/cv/cards/random
 * Description : Retourne <nb> CV(s) pour des cartes de manière aléatoire
 * Paramètre :
 * - nb : Nombre de CVs à retourner (11 par défaut)
 * Exemple : <server_url>/api/v1/cv/cards/random?nb=2
 */
router.get('/cards/random', (req, res) => {
  CVController.getRandomShortCVs(req.query.nb)
    .then((listeCVs) => {
      res.status(200).json(listeCVs);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : DELETE /api/<VERSION>/cv/<ID>
 * Description : Supprime le CV correspondant à l'<id> fournit dans l'URL.
 * Paramètre :
 * - id : ID du CV à supprimer
 * Exemple : <server_url>/api/v1/cv/27272727-aaaa-bbbb-cccc-012345678927
 */
router.delete('/:id', (req, res) => {
  CVController.deleteCV(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

module.exports = router;
