// eslint-disable-next-line import/newline-after-import
const express = require('express');
const router = express.Router();
const { auth } = require('../../../controllers/Auth');
const OpportunityController = require('../../../controllers/Opportunity');

/**
 * Route : POST /api/<VERSION>/opportunity
 * Description : Créé l'opportunité
 */
router.post('/', auth.required, (req, res) => {
  OpportunityController.createOpportunity(req.body)
    .then((opportunity) => res.status(200).json(opportunity))
    .catch((err) => {
      console.error(err);
      res.status(401).send(`Une erreur est survenue`);
    });
});

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
      console.error(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/...
 * Description : ...
 */
router.get('/user/public', auth.required, (req, res) => {
  OpportunityController.getOpportunities('Public')
    .then((listeOpportunities) => {
      res.status(200).json(listeOpportunities);
    })
    .catch((err) => {
      console.error(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/...
 * Description : ...
 */
router.get('/user/private/:id', auth.required, (req, res) => {
  OpportunityController.getUserOpportunities(req.params.id, 'Private')
    .then((listeOpportunities) => {
      res.status(200).json(listeOpportunities);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/...
 * Description : ...
 */
router.get('/user/:id', auth.required, (req, res) => {
  OpportunityController.getUserOpportunities(req.params.id)
    .then((listeOpportunities) => {
      res.status(200).json(listeOpportunities);
    })
    .catch((err) => {
      console.error(err);
      res.status(401).send('Une erreur est survenue');
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
      console.error(err);
      res.status(401).send(err);
    });
});

/**
 * Route : POST /api/<VERSION>/...
 * Description : ...
 */
router.post('/link', auth.required, (req, res) => {
  OpportunityController.addUserToOpportunity(
    req.body.opportunityId,
    req.body.userId
  )
    .then((opportunity) => res.status(200).json(opportunity))
    .catch((err) => {
      console.error(err);
      res.status(401).send(`Une erreur est survenue`);
    });
});

router.put('/user', auth.required, (req, res) => {
  OpportunityController.updateOpportunityUser(req.body)
    .then((oppUs) => {
      res.status(200).json(oppUs);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send(`Une erreur est survenue`);
    });
});

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
