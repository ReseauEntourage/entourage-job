const express = require('express');

const router = express.Router();
const { auth } = require('../../../controllers/Auth');
const OpportunityController = require('../../../controllers/Opportunity');
const { USER_ROLES } = require('../../../../constants');
const { checkCandidatOrCoachAuthorization } = require('../../../utils');

/**
 * Route : POST /api/<VERSION>/opportunity
 * Description : Créé l'opportunité
 */
router.post('/', auth(), (req, res) => {
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
router.get('/admin', auth([USER_ROLES.ADMIN]), (req, res) => {
  OpportunityController.getOpportunities(req.query.query)
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
router.get(
  '/user/private/:id',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    checkCandidatOrCoachAuthorization(req, res, req.params.id, () => {
      OpportunityController.getPrivateUserOpportunities(req.params.id)
        .then((listeOpportunities) => {
          res.status(200).json(listeOpportunities);
        })
        .catch((err) => {
          console.log(err);
          res.status(401).send('Une erreur est survenue');
        });
    });
  });

/**
 * Route : GET /api/<VERSION>/...
 * Description : ...
 */
router.get(
  '/user/all/:id',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    checkCandidatOrCoachAuthorization(req, res, req.params.id, () => {
      OpportunityController.getAllUserOpportunities(req.params.id)
        .then((listeOpportunities) => {
          res.status(200).json(listeOpportunities);
        })
        .catch((err) => {
          console.error(err);
          res.status(401).send('Une erreur est survenue');
        });
    });
  });

/**
 * Route : GET /api/<VERSION>/opportunity/<ID>
 * Description : Récupère l'opportunité associé à l'<ID> fournit
 */

/*
  router.get('/:id', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), (req, res) => {
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
*/

/**
 * Route : POST /api/<VERSION>/...
 * Description : ...
 */
router.post(
  '/join',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    checkCandidatOrCoachAuthorization(req, res, req.body.userId, () => {
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
  });

router.put('/', auth([USER_ROLES.ADMIN]), (req, res) => {
  OpportunityController.updateOpportunity(req.body)
    .then((opp) => {
      res.status(200).json(opp);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send(`Une erreur est survenue`);
    });
});

router.put('/join', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), (req, res) => {
  checkCandidatOrCoachAuthorization(req, res, req.body.UserId, () => {
    OpportunityController.updateOpportunityUser(req.body)
      .then((oppUs) => {
        res.status(200).json(oppUs);
      })
      .catch((err) => {
        console.log(err);
        res.status(401).send(`Une erreur est survenue`);
      });
  });
});

/**
 * Route : DELETE /api/<VERSION>/cv/<ID>
 * Description : Supprime le CV correspondant à l'<id> fournit dans l'URL.
 * Paramètre :
 * - id : ID du CV à supprimer
 * Exemple : <server_url>/api/v1/cv/27272727-aaaa-bbbb-cccc-012345678927
 */
router.delete('/:id', auth([USER_ROLES.ADMIN]), (req, res) => {
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
