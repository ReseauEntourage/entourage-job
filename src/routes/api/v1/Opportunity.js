import { auth } from 'src/controllers/Auth';
import * as OpportunityController from 'src/controllers/Opportunity';
import { OFFER_CANDIDATE_FILTERS_DATA, USER_ROLES } from 'src/constants';
import { checkCandidatOrCoachAuthorization } from 'src/utils';
import { logger } from 'src/utils/Logger';

import express from 'express';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import {
  createExternalDBOpportunity,
  updateExternalDBOpportunity,
} from 'src/helpers/ExternalDatabase';

const authorizedExternalOpportunityKeys = [
  'id',
  'status',
  'title',
  'company',
  'contract',
  'link',
  'externalOrigin',
  'description',
  'startOfContract',
  'endOfContract',
  'isPartTime',
  'department',
  'date',
];

const router = express.Router();

/**
 * Route : POST /api/<VERSION>/opportunity
 * Description : Create an opportunity
 * Response:
 * -  200 + created opportunity
 * -  401
 */
router.post('/', auth(), (req, res) => {
  const isLoggedAsAdmin = req.payload?.role === USER_ROLES.ADMIN;

  const { isAdmin, locations, shouldSendNotifications, isCopy, ...restBody } =
    req.body;

  if (isAdmin && !isLoggedAsAdmin) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  let promises;

  // location object { department, address }
  if (locations && Array.isArray(locations) && locations.length > 1) {
    promises = Promise.all(
      locations.map(({ department, address }) => {
        return OpportunityController.createOpportunity(
          { ...restBody, department, address },
          isAdmin,
          req.payload?.id,
          shouldSendNotifications,
          isCopy
        );
      })
    );
  } else {
    let opportunityToCreate = restBody;
    if (locations) {
      const locationsToTransform = Array.isArray(locations)
        ? locations[0]
        : locations;
      opportunityToCreate = {
        ...opportunityToCreate,
        ...locationsToTransform,
      };
    }

    promises = OpportunityController.createOpportunity(
      opportunityToCreate,
      isAdmin,
      req.payload?.id,
      shouldSendNotifications,
      isCopy
    );
  }

  return promises
    .then(async (opportunity) => {
      if (Array.isArray(opportunity)) {
        await createExternalDBOpportunity(
          opportunity.map(({ id }) => {
            return id;
          }),
          true
        );
      } else {
        await createExternalDBOpportunity(opportunity.id);
      }

      return res.status(200).json(opportunity);
    })
    .catch((err) => {
      logger(res).error(err);
      return res.status(401).send(err);
    });
});

/**
 * Route : POST /api/<VERSION>/opportunity/external
 * Description : Create an external opportunity
 * Response:
 * -  200 + created opportunity
 * -  401
 */
router.post(
  '/external',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    const { candidateId, ...restParams } = req.body;
    checkCandidatOrCoachAuthorization(req, res, candidateId, () => {
      const keys = Object.keys(restParams);
      const isAdmin = req.payload.role === USER_ROLES.ADMIN;

      if (
        isAdmin ||
        !keys.some((key) => {
          return !authorizedExternalOpportunityKeys.includes(key);
        })
      ) {
        OpportunityController.createExternalOpportunity(
          restParams,
          candidateId,
          isAdmin,
          req.payload?.id
        )
          .then(async (opportunity) => {
            await createExternalDBOpportunity(opportunity.id);
            return res.status(200).json(opportunity);
          })
          .catch((err) => {
            logger(res).error(err);
            return res.status(401).send(err);
          });
      } else {
        return res.status(401).send({ message: 'Unauthorized' });
      }
    });
  }
);

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
  OpportunityController.getAdminOpportunities(req.query)
    .then((listeOpportunities) => {
      logger(res).log(
        `Opportunités récupérés (Total : ${listeOpportunities.length})`
      );
      return res.status(200).json(listeOpportunities);
    })
    .catch((err) => {
      logger(res).error(err);
      return res.status(401).send(err);
    });
});

/**
 * Route : GET /api/<VERSION>/opportunity/admin/count
 * Description : Count all the pending opportunities
 * Params:
 * -  QUERY: string, optional
 * Responses:
 * - 200 + number of pending opportunities
 * - 401
 */
router.get('/admin/count', auth([USER_ROLES.ADMIN]), (req, res) => {
  OpportunityController.countPendingOpportunitiesCount(req.payload.zone)
    .then((pendingOpportunities) => {
      res.status(200).json(pendingOpportunities);
    })
    .catch((err) => {
      logger(res).error(err);
      res.status(401).send(err);
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
          return res.status(200).json(listeOpportunities);
        })
        .catch((err) => {
          logger(res).error(err);
          return res.status(401).send(err);
        });
    });
  }
);

/**
 * Route : GET /api/<VERSION>/user/all/<ID>
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
      const { department, type, ...restQuery } = req.query;
      OpportunityController.getAllUserOpportunities(req.params.id, req.query)
        .then((zoneOpportunities) => {
          if (!department || type !== OFFER_CANDIDATE_FILTERS_DATA[0].tag) {
            return res.status(200).json({
              offers: zoneOpportunities,
              otherOffers: [],
            });
          } else {
            const otherDepartments = DEPARTMENTS_FILTERS.filter((dept) => {
              return !department.includes(dept.value);
            });
            OpportunityController.getAllUserOpportunities(req.params.id, {
              department: otherDepartments.map((dept) => {
                return dept.value;
              }),
              type,
              ...restQuery,
            }).then((otherOpportunities) => {
              return res.status(200).json({
                offers: zoneOpportunities,
                otherOffers: otherOpportunities,
              });
            });
          }
        })
        .catch((err) => {
          logger(res).error(err);
          return res.status(401).send(err);
        });
    });
  }
);

/**
 * Route : GET /api/<VERSION>/user/count/<ID>
 * Description : Get the number of unseen opportunities associated to a user wich are
 * validated (isValidated: true)
 * Params:
 * -  ID: string (user's id)
 * Responses:
 * -  200 + the unseen count
 * -  401
 */
router.get(
  '/user/count/:id',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    checkCandidatOrCoachAuthorization(req, res, req.params.id, () => {
      OpportunityController.getUnseenUserOpportunitiesCount(req.params.id)
        .then((opportunitiesCount) => {
          return res.status(200).json(opportunitiesCount);
        })
        .catch((err) => {
          logger(res).error(err);
          return res.status(401).send(err);
        });
    });
  }
);

/**
 * Route : GET /api/<VERSION>/opportunity/<ID>
 * Description : Récupère l'opportunité associé à l'<ID> fournit
 */
router.get(
  '/:id',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    OpportunityController.getOpportunity(
      req.params.id,
      req.payload.role === USER_ROLES.ADMIN,
      req.payload.role === USER_ROLES.COACH
        ? req.payload.candidatId
        : req.payload.id
    )
      .then((opportunity) => {
        if (opportunity && Object.keys(opportunity).length > 0) {
          logger(res).log(`Opportunité trouvé`);
          return res.status(200).json(opportunity);
        } else {
          logger(res).log(`Aucune Opportunité trouvé`);
          return res.status(204).send(null);
        }
      })
      .catch((err) => {
        logger(res).error(err);
        return res.status(401).send(err);
      });
  }
);

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
        .then(async (opportunityUser) => {
          await updateExternalDBOpportunity(opportunityUser.OpportunityId);
          return res.status(200).json(opportunityUser);
        })
        .catch((err) => {
          logger(res).error(err);
          return res.status(401).send(err);
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
  const { shouldSendNotifications, ...restOpportunity } = req.body;
  OpportunityController.updateOpportunity(
    restOpportunity,
    shouldSendNotifications
  )
    .then(async (opportunity) => {
      await updateExternalDBOpportunity(opportunity.id);
      return res.status(200).json(opportunity);
    })
    .catch((err) => {
      logger(res).error(err);
      return res.status(401).send(err);
    });
});

/**
 * Route: PUT /api/<VERSION>/opportunity/bulk
 * Description: Admins can update an opportunity
 * Body:
 * - <Opportunity> : object containint ID and fields to update
 * Responses:
 * - 200 + updated opportunity
 * - 401
 */
router.put('/bulk', auth([USER_ROLES.ADMIN]), (req, res) => {
  const { attributes, ids } = req.body;
  OpportunityController.updateBulkOpportunity(attributes, ids)
    .then(async (updatedOpportunities) => {
      await updateExternalDBOpportunity(updatedOpportunities.updatedIds);
      return res.status(200).json(updatedOpportunities);
    })
    .catch((err) => {
      logger(res).error(err);
      return res.status(401).send(err);
    });
});

/**
 * Route: PUT /api/<VERSION>/opportunity/external
 * Description: Admins and users can update an external opportunity
 * Body:
 * - <Opportunity> : object containing ID and fields to update
 * Responses:
 * - 200 + updated opportunity
 * - 401
 */
router.put(
  '/external',
  auth([USER_ROLES.CANDIDAT, USER_ROLES.COACH, USER_ROLES.ADMIN]),
  (req, res) => {
    const { candidateId, ...restParams } = req.body;
    checkCandidatOrCoachAuthorization(req, res, candidateId, () => {
      const keys = Object.keys(restParams);
      const isAdmin = req.payload.role === USER_ROLES.ADMIN;
      if (
        isAdmin ||
        !keys.some((key) => {
          return !authorizedExternalOpportunityKeys.includes(key);
        })
      ) {
        OpportunityController.updateExternalOpportunity(
          restParams,
          candidateId,
          isAdmin
        )
          .then(async (opportunity) => {
            if (opportunity) {
              await updateExternalDBOpportunity(opportunity.id);
              return res.status(200).json(opportunity);
            } else {
              return res.status(401).send({ message: 'Unauthorized' });
            }
          })
          .catch((err) => {
            logger(res).error(err);
            return res.status(401).send(err);
          });
      } else {
        return res.status(401).send({ message: 'Unauthorized' });
      }
    });
  }
);
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
        .then(async (opportunityUser) => {
          await updateExternalDBOpportunity(opportunityUser.OpportunityId);
          return res.status(200).json(opportunityUser);
        })
        .catch((err) => {
          logger(res).error(err);
          return res.status(401).send(err);
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
/*
  router.delete('/:id', auth([USER_ROLES.ADMIN]), (req, res) => {
    OpportunityController.deleteOpportunity(req.params.id)
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        logger(res).error(err);
        return res.status(401).send(err);
      });
  });
*/

export default router;
