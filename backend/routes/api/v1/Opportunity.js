// eslint-disable-next-line import/newline-after-import
const express = require('express');
const router = express.Router();
const { auth } = require('../../../controllers/Auth');
const OpportunityController = require('../../../controllers/Opportunity');

/**
 * Route : GET /api/<VERSION>/opportunity
 * Description : Récupère toutes les opportunités
 */
router.get('/', auth.required, (req, res) => {
  OpportunityController.getOpportunities()
    .then((listeOpportunities) => {
      console.log(
        `Opportunités récupérés (Total : ${listeOpportunities.length}`
      );
      res.status(200).json(listeOpportunities);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : POST /api/<VERSION>/opportunity
 * Description : Créé l'opportunité
 */
router.post('/', auth.required, (req, res) => {
  OpportunityController.createOpportunity(req.body)
    .then((opportunity) => res.status(200).json(opportunity))
    .catch((err) => {
      console.log(`Une erreur est survenue`);
      res.status(401).send(err);
    });
});

/**
 * Route : GET /api/<VERSION>/opportunity/<ID>
 * Description : Récupère l'opportunité associé à l'<ID> fournit
 */
router.get('/:id', auth.required, (req, res) => {
  OpportunityController.getOpportunity(req.params.id)
    .then((opportunity) => {
      if (opportunity) {
        console.log(`Opportunité trouvé`);
        res.status(200).json(opportunity);
      } else {
        console.log(`Aucune Opportunité trouvé`);
        res.status(204).json(opportunity);
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
/* router.put('/:id', (req, res) => {
  CVController.setCV(req.params.id, req.body)
    .then((cv) => {
      console.log(`CV modifié`);
      res.status(200).json(cv);
    })
    .catch((err) => {
      console.log(`Une erreur est survenue`);
      res.status(401).send(err);
    });
}); */

/**
 * Route : DELETE /api/<VERSION>/cv/<ID>
 * Description : Supprime le CV correspondant à l'<id> fournit dans l'URL.
 * Paramètre :
 * - id : ID du CV à supprimer
 * Exemple : <server_url>/api/v1/cv/27272727-aaaa-bbbb-cccc-012345678927
 */
router.delete('/:id', auth.required, (req, res) => {
  OpportunityController.deleteOpportunity(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

module.exports = router;
