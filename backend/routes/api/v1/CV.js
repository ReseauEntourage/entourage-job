// eslint-disable-next-line import/newline-after-import
const express = require('express');
const router = express.Router();
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
  let cvCreated;

  CVController.createCV(req.body)
    .then((cv) => {
      cvCreated = cv;
      // creation de limage de preview cv
      generateCVPreview(
        cvCreated.firstName.toUpperCase(),
        "A besoin d'un coup de pouce pour travailler dans...",
        req.body.ambitions.length > 0
          ? req.body.ambitions.join('. ').toUpperCase()
          : '',
        `../../static/img/arthur.png`,
        `../../static/img/${cvCreated.url}-preview.jpg`
      )
        .then(console.log)
        .catch(console.error);
      return Promise.resolve();
    })
    .then(() => res.status(200).json(cvCreated))
    .catch((err) => {
      console.log(`Une erreur est survenue`);
      res.status(401).send(err);
    });
});

/**
 * Route : GET /api/<VERSION>/cv/<URL>
 * Description : Récupère le CV associé à l'<URL> fournit
 */
router.get('/:url', (req, res) => {
  CVController.getCV(req.params.url)
    .then((cv) => {
      console.log(`CV trouvé`);
      // res.status(200).send(JSON.stringify(cv, null, 4));
      res.status(200).json(cv);
    })
    .catch((err) => {
      console.log(`Aucun CV trouvé`);
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
