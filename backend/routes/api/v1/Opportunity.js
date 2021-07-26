const express = require('express');

const router = express.Router();
const { auth } = require('../../../controllers/Auth');
const OpportunityController = require('../../../controllers/Opportunity');
const { USER_ROLES } = require('../../../../constants');
const { checkCandidatOrCoachAuthorization } = require('../../../utils');
const { logger } = require('../../../utils/Logger');

// Temp route to update the opportunities on Airtable
router.post('/update-airtable', auth([USER_ROLES.ADMIN]), (req, res) => {
  checkCandidatOrCoachAuthorization(req, res, req.body.userId, () => {
    OpportunityController.refreshAirtableOpportunities()
      .then(() => {
        return res.status(200);
      })
      .catch((err) => {
        logger(res).error(err);
        res.status(401).send(`Une erreur est survenue`);
      });
  });
});

/**
 * Route : POST /api/<VERSION>/opportunity
 * Description : Create an opportunity
 * Response:
 * -  200 + created opportunity
 * -  401
 */
router.post('/', auth(), (req, res) => {
  const { isAdmin, ...restBody } = req.body;
  OpportunityController.createOpportunity(restBody, isAdmin)
    .then((opportunity) => {
      return res.status(200).json(opportunity);
    })
    .catch((err) => {
      logger(res).error(err);
      res.status(401).send(`Une erreur est survenue`);
    });
});

/**
 * Route : GET /api/<VERSION>/opportunity/admin/<QUERY>
 * Description : Read all the opportunities matching the query
 * on the fields title, recruiterName, location, company. If no
 * query returns all opportunities.
 * Params:
 * -  QUERY: string, optional
 * Responses:
 * - 200 + list of opportunities
 * - 401
 */
router.get('/admin', auth([USER_ROLES.ADMIN]), (req, res) => {
  OpportunityController.getOpportunities(req.query.query)
    .then((listeOpportunities) => {
      logger(res).log(
        `Opportunités récupérés (Total : ${listeOpportunities.length})`
      );
      res.status(200).json(listeOpportunities);
    })
    .catch((err) => {
      logger(res).error(err);
      res.status(401).send('Une erreur est survenue');
    });
});

/**
 * Route : GET /api/<VERSION>/user/private/<ID>
 * Description : Read the opportunities associated to a user wich are
 * private as well as the general opportunities and the candidate status about them
 * Params:
 * - ID: string (user's id)
 * Responses:
 * -  200 + a list of the user's opportunities
 * -  401
 */
router.get(
  '/user/private/:id',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    checkCandidatOrCoachAuthorization(req, res, req.params.id, () => {
      OpportunityController.getPrivateUserOpportunities(
        req.params.id,
        req.query
      )
        .then((listeOpportunities) => {
          res.status(200).json(listeOpportunities);
        })
        .catch((err) => {
          logger(res).error(err);
          res.status(401).send('Une erreur est survenue');
        });
    });
  }
);

/**
 * Route : GET /api/<VERSION>/user/private/<ID>
 * Description : Read the opportunities associated to a user wich are
 * validated (isValidated: true)
 * Params:
 * -  ID: string (user's id)
 * Responses:
 * -  200 + a list of the user's opportunities
 * -  401
 */
router.get(
  '/user/all/:id',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    checkCandidatOrCoachAuthorization(req, res, req.params.id, () => {
      OpportunityController.getAllUserOpportunities(req.params.id, req.query)
        .then((listeOpportunities) => {
          res.status(200).json(listeOpportunities);
        })
        .catch((err) => {
          logger(res).error(err);
          res.status(401).send('Une erreur est survenue');
        });
    });
  }
);

/**
 * Route : GET /api/<VERSION>/opportunity/<ID>
 * Description : Récupère l'opportunité associé à l'<ID> fournit
 */

/*
  router.get('/:id', auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]), (req, res) => {
    OpportunityController.getOpportunity(req.params.id)
    .then((opportunity) => {
      if (opportunity) {
        logger(res).log(`Opportunité trouvé`);
        res.status(200).json(opportunity);
      } else {
        logger(res).log(`Aucune Opportunité trouvé`);
        res.status(204).json(opportunity);
      }
    })
    .catch((err) => {
      logger(res).error(err);
      res.status(401).send(err);
    });
  });
*/

/**
 * Route: POST /api/<VERSION>/opportunity/join
 * Description: Create an association between a user and an opporrtunity
 * in the table opportunity_user.
 * Body: {
 *          opportunityId: string,
 *          userID: string,
 *        }
 * Responses:
 * - 200 + created opportunity_user
 * - 401
 */
router.post(
  '/join',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    checkCandidatOrCoachAuthorization(req, res, req.body.userId, () => {
      OpportunityController.addUserToOpportunity(
        req.body.opportunityId,
        req.body.userId,
        req.body.seen
      )
        .then((opportunity) => {
          return res.status(200).json(opportunity);
        })
        .catch((err) => {
          logger(res).error(err);
          res.status(401).send(`Une erreur est survenue`);
        });
    });
  }
);

/**
 * Route: PUT /api/<VERSION>/opportunity
 * Description: Admins can update an opportunity
 * Body:
 * - <Opportunity> : object containint ID and fields to update
 * Responses:
 * - 200 + updated opportunity
 * - 401
 */
router.put('/', auth([USER_ROLES.ADMIN]), (req, res) => {
  OpportunityController.updateOpportunity(req.body)
    .then((opp) => {
      res.status(200).json(opp);
    })
    .catch((err) => {
      logger(res).error(err);
      res.status(401).send(`Une erreur est survenue`);
    });
});
/**
 * Route: UPDATE /api/<VERSION>/opportunity/join
 * Description: Update an association between a user and an opporrtunity
 * in the table opportunity_user.
 * Body: {
 *          id: string, //the opportunity id
 *          UserId: string,
 *          status: integer
 *          bookmarked: boolean
 *          archived: boolean
 *          note: string
 *          seen: boolean
 * }
 */
router.put(
  '/join',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    checkCandidatOrCoachAuthorization(req, res, req.body.UserId, () => {
      OpportunityController.updateOpportunityUser(req.body)
        .then((oppUs) => {
          res.status(200).json(oppUs);
        })
        .catch((err) => {
          logger(res).error(err);
          res.status(401).send(`Une erreur est survenue`);
        });
    });
  }
);

/**
 * Route : DELETE /api/<VERSION>/opportunity/<ID>
 * Description : Delete the opportunity specified in params
 * Params :
 * - ID : id of the opportunity to delete
 * Response:
 * -  200
 * -  401
 */
router.delete('/:id', auth([USER_ROLES.ADMIN]), (req, res) => {
  OpportunityController.deleteOpportunity(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      logger(res).error(err);
      res.status(401).send('Une erreur est survenue');
    });
});

module.exports = router;
