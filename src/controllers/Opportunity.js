import {
  JOBS,
  MAILJET_TEMPLATES,
  OFFER_STATUS,
  OPPORTUNITY_FILTERS_DATA,
} from 'src/constants';

import { addToWorkQueue } from 'src/jobs';

import { cleanOpportunity } from 'src/utils';
import {
  findContractType,
  findOfferStatus,
  getAdminMailsFromDepartment,
} from 'src/utils/Finding';

import moment from 'moment';
import { Op } from 'sequelize';

import {
  filterAdminOffersByType,
  filterCandidateOffersByType,
  filterOffersByStatus,
  getFiltersObjectsFromQueryParams,
  getOfferOptions,
} from 'src/utils/Filters';

import { models, sequelize } from 'src/db/models';
import { searchInColumnWhereOption } from 'src/utils/DatabaseQueries';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import _ from 'lodash';
import { getUser } from 'src/controllers/User';
import { getCVbyUserId } from 'src/controllers/CV';

const offerTable = process.env.AIRTABLE_OFFERS;
const {
  BusinessLine,
  Opportunity_User,
  Opportunity_BusinessLine,
  Opportunity,
  User_Candidat,
  User,
} = models;

const ATTRIBUTES_OPPORTUNITY_CANDIDATES = [
  'id',
  'updatedAt',
  'createdAt',
  'title',
  'company',
  'description',
  'companyDescription',
  'numberOfPositions',
  'prerequisites',
  'skills',
  'contract',
  'endOfContract',
  'startOfContract',
  'isPartTime',
  'recruiterName',
  'recruiterFirstName',
  'recruiterPosition',
  'isPublic',
  'recruiterMail',
  'date',
  'department',
  'message',
];

const INCLUDE_OPPORTUNITY_CANDIDATE = [
  {
    model: User,
    attributes: ['id', 'email', 'firstName', 'lastName', 'gender', 'zone'],
    include: [
      {
        model: User_Candidat,
        as: 'candidat',
        attributes: ['employed', 'hidden', 'note', 'url'],
        include: [
          {
            model: User,
            as: 'coach',
            attributes: ['id', 'email', 'firstName', 'lastName', 'zone'],
          },
        ],
      },
    ],
  },
];

const INCLUDE_OPPORTUNITY_COMPLETE = [
  {
    model: BusinessLine,
    as: 'businessLines',
    attributes: ['name'],
    through: { attributes: [] },
  },
  {
    model: Opportunity_User,
    as: 'userOpportunity',
    attributes: [
      'id',
      'UserId',
      'status',
      'seen',
      'bookmarked',
      'archived',
      'note',
      'updatedAt',
      'recommended',
    ],
    include: INCLUDE_OPPORTUNITY_CANDIDATE,
  },
];

const INCLUDE_OPPORTUNITY_USER = [
  {
    model: Opportunity_User,
    as: 'userOpportunity',
    attributes: [
      'id',
      'UserId',
      'status',
      'seen',
      'bookmarked',
      'archived',
      'note',
      'recommended',
    ],
  },
];

const INCLUDE_OPPORTUNITY_COMPLETE_ADMIN = [
  {
    model: BusinessLine,
    as: 'businessLines',
    attributes: ['name'],
    through: { attributes: [] },
  },
  {
    model: Opportunity_User,
    as: 'userOpportunity',
    include: [
      {
        model: User,
        attributes: [
          'id',
          'email',
          'firstName',
          'lastName',
          'gender',
          'email',
          'zone',
        ],
        paranoid: false,
      },
    ],
    attributes: [
      'id',
      'UserId',
      'status',
      'bookmarked',
      'archived',
      'note',
      'seen',
      'recommended',
    ],
  },
];

const getOfferSearchOptions = (search) => {
  if (search) {
    return {
      [Op.or]: [
        searchInColumnWhereOption('Opportunity.title', search),
        searchInColumnWhereOption('Opportunity.company', search),
        searchInColumnWhereOption('Opportunity.recruiterName', search),
        searchInColumnWhereOption('Opportunity.recruiterFirstName', search),
        searchInColumnWhereOption('Opportunity.recruiterMail', search),
        searchInColumnWhereOption('Opportunity.recruiterPosition', search),
        searchInColumnWhereOption('Opportunity.recruiterPhone', search),
        searchInColumnWhereOption('Opportunity.description', search),
        searchInColumnWhereOption('Opportunity.companyDescription', search),
        searchInColumnWhereOption('Opportunity.skills', search),
        searchInColumnWhereOption('Opportunity.prerequisites', search),
        searchInColumnWhereOption('Opportunity.department', search),
        searchInColumnWhereOption('Opportunity.contract', search),
        searchInColumnWhereOption('Opportunity.message', search),
        searchInColumnWhereOption('Opportunity.location', search),
        searchInColumnWhereOption('Opportunity.department', search),
      ],
    };
  }
  return {};
};

const destructureOptionsAndParams = (params) => {
  const { search, type: typeParams, ...restParams } = params;

  const filtersObj = getFiltersObjectsFromQueryParams(
    restParams,
    OPPORTUNITY_FILTERS_DATA
  );

  const { status: statusParams, ...restFiltersObj } = filtersObj;

  const searchOptions = getOfferSearchOptions(search);
  const filterOptions = getOfferOptions(restFiltersObj);

  return {
    typeParams,
    statusParams,
    searchOptions,
    filterOptions,
  };
};

const getAirtableOpportunityFields = (
  opportunity,
  candidates,
  businessLines
) => {
  const commonFields = {
    OpportunityId: opportunity.id,
    Entreprise: opportunity.company,
    Titre: opportunity.title,
    Nom: opportunity.recruiterName,
    Prénom: opportunity.recruiterFirstName,
    Mail: opportunity.recruiterMail,
    Téléphone: opportunity.recruiterPhone,
    Fonction: opportunity.recruiterPosition,
    'Description poste': opportunity.description,
    'Description entreprise': opportunity.companyDescription,
    'Compétences requises': opportunity.skills,
    'Pré-requis': opportunity.prerequisites,
    "Secteur d'activité": businessLines,
    Publique: opportunity.isPublic,
    Validé: opportunity.isValidated,
    Archivé: opportunity.isArchived,
    'Date de création': opportunity.createdAt,
    Département: opportunity.department,
    Contrat: findContractType(opportunity.contract)?.label,
    'Début de contrat': opportunity.startOfContract,
    'Fin de contrat': opportunity.endOfContract,
    'Temps partiel ?': opportunity.isPartTime,
    'Nombre de postes': opportunity.numberOfPositions,
    'Souhaite être recontacté': opportunity.beContacted,
    'Message personnalisé': opportunity.message,
  };

  return candidates && candidates.length > 0
    ? [
        ...candidates.map((candidate) => {
          const offerStatus = findOfferStatus(candidate.status);
          return {
            ...commonFields,
            OpportunityUserId: candidate.id,
            Candidat: `${candidate.User.firstName} ${candidate.User.lastName}`,
            Statut:
              opportunity.isPublic && offerStatus.alt
                ? offerStatus.alt
                : offerStatus.label,
            Commentaire: candidate.note,
            'Recommandée ?': candidate.recommended,
          };
        }),
        commonFields,
      ]
    : commonFields;
};

const updateTable = async (opportunity, candidates) => {
  const fields = getAirtableOpportunityFields(
    opportunity,
    candidates,
    opportunity.businessLines
  );

  return addToWorkQueue({
    type: JOBS.JOB_TYPES.UPDATE_AIRTABLE,
    tableName: offerTable,
    fields,
  });
};

const createOpportunity = async (data, isAdmin) => {
  console.log(`createOpportunity - Création de l'opportunité`);

  console.log(`Etape 1 - Création de l'opportunité de base`);
  const modelOpportunity = await Opportunity.create(data);

  if (data.businessLines) {
    console.log(`Etape 2 - BusinessLine`);
    const businessLines = await Promise.all(
      data.businessLines.map((name) => {
        return BusinessLine.findOrCreate({
          where: { name },
        }).then((model) => {
          return model[0];
        });
      })
    );
    await modelOpportunity.addBusinessLines(businessLines);
  }

  let candidates = [];
  if (data.candidatesId && data.candidatesId.length > 0) {
    console.log(
      `Etape 4 - Détermine le(s) User(s) à qui l'opportunité s'adresse`
    );
    candidates = await Promise.all(
      data.candidatesId.map((candidatId) => {
        return Opportunity_User.create({
          OpportunityId: modelOpportunity.id,
          UserId: candidatId, // to rename in userId,
          recommended: modelOpportunity.isPublic,
        }).then((model) => {
          return model[0];
        });
      })
    );

    candidates = await Opportunity_User.findAll({
      where: {
        UserId: data.candidatesId,
        OpportunityId: modelOpportunity.id,
      },
      include: INCLUDE_OPPORTUNITY_CANDIDATE,
    });
  }

  console.log(`Etape finale - Reprendre l'opportunité complète à retourner`);

  const finalOpportunity = await Opportunity.findByPk(modelOpportunity.id, {
    include: INCLUDE_OPPORTUNITY_USER,
  });

  const cleanedOpportunity = cleanOpportunity(modelOpportunity);

  const fields = getAirtableOpportunityFields(
    finalOpportunity,
    candidates,
    data.businessLines
  );

  await addToWorkQueue({
    type: JOBS.JOB_TYPES.INSERT_AIRTABLE,
    tableName: offerTable,
    fields,
  });

  if (!isAdmin) {
    const adminMails = getAdminMailsFromDepartment(finalOpportunity.department);
    await addToWorkQueue({
      type: JOBS.JOB_TYPES.SEND_MAIL,
      toEmail: adminMails.companies,
      templateId: MAILJET_TEMPLATES.OFFER_TO_VALIDATE,
      variables: {
        ..._.omitBy(
          {
            ...cleanedOpportunity,
            contract: findContractType(cleanedOpportunity.contract)?.label,
          },
          _.isNil
        ),
      },
    });

    const candidatesString =
      !finalOpportunity.isPublic && candidates && candidates.length > 0
        ? candidates
            .map((candidate) => {
              return `${candidate.User.firstName} ${candidate.User.lastName}`;
            })
            .join(',')
        : '';

    const businessLinesString = data.businessLines
      ? data.businessLines.join(', ')
      : '';

    await addToWorkQueue({
      type: JOBS.JOB_TYPES.SEND_MAIL,
      toEmail: finalOpportunity.recruiterMail,
      templateId: MAILJET_TEMPLATES.OFFER_SENT,
      variables: {
        ..._.omitBy(
          {
            ...cleanedOpportunity,
            contract: findContractType(cleanedOpportunity.contract)?.label,
          },
          _.isNil
        ),
        candidates: candidatesString,
        businessLines: businessLinesString,
      },
    });
  }

  return cleanedOpportunity;
};

const deleteOpportunity = (id) => {
  console.log(
    `deleteOpportunity - Suppression d'une opportunité à partir de son id`
  );
  return Opportunity.destroy({
    where: { id },
  });
};

const getOpportunities = async (params) => {
  const { typeParams, statusParams, searchOptions, filterOptions } =
    destructureOptionsAndParams(params);

  const options = {
    include: INCLUDE_OPPORTUNITY_COMPLETE_ADMIN,
    paranoid: false,
  };

  const opportunities = await Opportunity.findAll({
    ...options,
    where: {
      ...searchOptions,
      ...filterOptions,
    },
  });

  const cleanedOpportunites = opportunities.map((model) => {
    return cleanOpportunity(model);
  });

  const filteredTypeOpportunites = filterAdminOffersByType(
    cleanedOpportunites,
    typeParams
  );

  return {
    offers: filterOffersByStatus(filteredTypeOpportunites, statusParams),
  };
};

const countPendingOpportunitiesCount = async (zone) => {
  const locationFilters = DEPARTMENTS_FILTERS.filter((dept) => {
    return zone === dept.zone;
  });
  const filterOptions =
    locationFilters.length > 0
      ? getOfferOptions({ department: locationFilters })
      : {};

  const pendingOpportunitiesCount = await Opportunity.count({
    where: {
      ...filterOptions,
      isValidated: false,
      isArchived: false,
    },
  });

  return {
    pendingOpportunities: pendingOpportunitiesCount,
  };
};

const getLatestOpportunities = async () => {
  const options = {
    include: INCLUDE_OPPORTUNITY_COMPLETE_ADMIN,
    paranoid: false,
  };

  const lastWeek = moment().subtract(7, 'd');

  const opportunities = await Opportunity.findAll({
    ...options,
    where: {
      isPublic: true,
      isValidated: true,
      createdAt: {
        [Op.gt]: lastWeek.toDate(),
      },
    },
  });

  return opportunities.map((model) => {
    return cleanOpportunity(model);
  });
};

const getPublicOpportunities = async () => {
  const opportunities = await Opportunity.findAll({
    include: INCLUDE_OPPORTUNITY_COMPLETE,
    where: {
      isPublic: true,
      isValidated: true,
    },
  });

  return {
    offers: opportunities.map((model) => {
      return cleanOpportunity(model);
    }),
  };
};

const getPrivateUserOpportunities = async (userId, params) => {
  const { statusParams, searchOptions, filterOptions } =
    destructureOptionsAndParams(params);

  console.log(`getOpportunities - Récupérer les opportunités`);
  const opportunityUsers = await Opportunity_User.findAll({
    where: { UserId: userId },
    attributes: ['OpportunityId'],
  });

  const opportunities = await Opportunity.findAll({
    include: INCLUDE_OPPORTUNITY_COMPLETE_ADMIN,
    where: {
      id: opportunityUsers.map((model) => {
        return model.OpportunityId;
      }),
      ...searchOptions,
      ...filterOptions,
    },
  });

  const cleanedOpportunities = opportunities.map((model) => {
    return cleanOpportunity(model);
  });

  return {
    offers: filterOffersByStatus(cleanedOpportunities, statusParams, userId),
  };
};

const getAllUserOpportunities = async (userId, params = {}) => {
  const { typeParams, statusParams, searchOptions, filterOptions } =
    destructureOptionsAndParams(params);

  const opportunityUsers = await Opportunity_User.findAll({
    where: { UserId: userId },
    attributes: ['OpportunityId'],
  });

  const opportunities = await Opportunity.findAll({
    attributes: ATTRIBUTES_OPPORTUNITY_CANDIDATES,
    include: INCLUDE_OPPORTUNITY_COMPLETE,
    where: {
      [Op.or]: [
        { isPublic: true, isValidated: true },
        {
          id: opportunityUsers.map((model) => {
            return model.OpportunityId;
          }),
          isPublic: false,
          isValidated: true,
        },
      ],
      ...searchOptions,
      ...filterOptions,
    },
  });

  const finalOpportunities = opportunities.map((model) => {
    const opportunity = cleanOpportunity(model);
    if (
      opportunityUsers.userOpportunity &&
      opportunityUsers.userOpportunity.length > 0
    ) {
      opportunityUsers.userOpportunity.sort((a, b) => {
        return b.updatedAt - a.updatedAt;
      });
    }
    opportunity.userOpportunity = opportunity.userOpportunity.find((uo) => {
      return uo.UserId === userId;
    });
    if (!opportunity.userOpportunity) {
      delete opportunity.userOpportunity;
    }
    return opportunity;
  });

  // order by bookmarked, then by new, then by status, then by date
  finalOpportunities.sort((a, b) => {
    if (a.userOpportunity || b.userOpportunity) {
      if (a.userOpportunity && b.userOpportunity) {
        if (a.userOpportunity.bookmarked === b.userOpportunity.bookmarked) {
          if (a.userOpportunity.seen === b.userOpportunity.seen) {
            if (a.userOpportunity.status === b.userOpportunity.status) {
              return new Date(b.date) - new Date(a.date);
            }
            if (
              a.userOpportunity.status >= OFFER_STATUS[4].value &&
              b.userOpportunity.status >= OFFER_STATUS[4].value
            ) {
              return b.userOpportunity.status - a.userOpportunity.status;
            }
            if (
              a.userOpportunity.status >= OFFER_STATUS[4].value &&
              b.userOpportunity.status < OFFER_STATUS[4].value
            ) {
              return 1;
            }
            if (
              a.userOpportunity.status < OFFER_STATUS[4].value &&
              b.userOpportunity.status >= OFFER_STATUS[4].value
            ) {
              return -1;
            }

            return b.userOpportunity.status - a.userOpportunity.status;
          }
          if (a.userOpportunity.seen && !b.userOpportunity.seen) {
            return -1;
          }
          if (!a.userOpportunity.seen && b.userOpportunity.seen) {
            return 1;
          }
        }
        if (a.userOpportunity.bookmarked && !b.userOpportunity.bookmarked) {
          return -1;
        }
        if (!a.userOpportunity.bookmarked && b.userOpportunity.bookmarked) {
          return 1;
        }
      }

      if (b.userOpportunity) {
        return -1;
      }
      if (a.userOpportunity) {
        return 1;
      }
    }
    return new Date(b.date) - new Date(a.date);
  });

  const filteredTypeOpportunities = filterCandidateOffersByType(
    finalOpportunities,
    typeParams
  );

  return filterOffersByStatus(filteredTypeOpportunities, statusParams, userId);
};

const getUnseenUserOpportunitiesCount = async (candidatId) => {
  const user = await getUser(candidatId);
  const cv = await getCVbyUserId(candidatId);

  const locationFilters = DEPARTMENTS_FILTERS.filter((dept) => {
    return cv.locations && cv.locations.length > 0
      ? cv.locations.includes(dept.value)
      : user.zone === dept.zone;
  });

  const filterOptions =
    locationFilters.length > 0
      ? getOfferOptions({ department: locationFilters })
      : {};

  const opportunityUsers = await Opportunity_User.findAll({
    where: { UserId: candidatId },
    attributes: ['OpportunityId'],
  });

  const opportunities = await Opportunity.findAll({
    include: INCLUDE_OPPORTUNITY_COMPLETE,
    where: {
      [Op.or]: [
        { isPublic: true, isValidated: true },
        {
          id: opportunityUsers.map((model) => {
            return model.OpportunityId;
          }),
          isPublic: false,
          isValidated: true,
        },
      ],
      ...filterOptions,
    },
  });

  const filteredOpportunities = opportunities
    .map((model) => {
      return cleanOpportunity(model);
    })
    .filter((opportunity) => {
      return (
        !opportunity.userOpportunity ||
        opportunity.userOpportunity.length === 0 ||
        !opportunity.userOpportunity.find((opp) => {
          return opp.UserId === candidatId;
        }) ||
        opportunity.userOpportunity.find((opp) => {
          return opp.UserId === candidatId;
        }).seen === false
      );
    });

  return {
    unseenOpportunities: filteredOpportunities.length,
  };
};

const getOpportunity = async (opportunityId, isAdmin, candidateId) => {
  if (isAdmin) {
    const model = await Opportunity.findByPk(opportunityId, {
      include: INCLUDE_OPPORTUNITY_COMPLETE,
    });

    return cleanOpportunity(model);
  }

  const userOpportunities = await getAllUserOpportunities(candidateId);
  return userOpportunities.find((opportunity) => {
    return opportunity.id === opportunityId;
  });
};

const updateOpportunityAirtable = async (opportunityId) => {
  const finalOpportunity = await getOpportunity(opportunityId, true);

  try {
    await updateTable(finalOpportunity, finalOpportunity.userOpportunity);
  } catch (err) {
    console.error(err);
    console.log('Failed to update table with modified offer.');
  }
};

const refreshAirtableOpportunities = async () => {
  const opportunities = await Opportunity.findAll({
    attributes: ['id'],
  });

  await Promise.all(
    opportunities.map((opportunity) => {
      return updateOpportunityAirtable(opportunity.id);
    })
  );
};

const addUserToOpportunity = async (opportunityId, userId, seen) => {
  let modelOpportunityUser = await Opportunity_User.findOne({
    where: {
      OpportunityId: opportunityId,
      UserId: userId,
    },
  });

  if (modelOpportunityUser) {
    modelOpportunityUser = await Opportunity_User.update(
      {
        seen: !!seen,
      },
      {
        where: {
          OpportunityId: opportunityId,
          UserId: userId,
        },
        individualHooks: true,
        attributes: [
          'id',
          'UserId',
          'OpportunityId',
          'status',
          'bookmarked',
          'archived',
          'note',
          'seen',
          'recommended',
        ],
      }
    ).then((model) => {
      return model && model.length > 1 && model[1][0];
    });
  } else {
    modelOpportunityUser = await Opportunity_User.create({
      OpportunityId: opportunityId,
      UserId: userId,
      seen: !!seen,
    });
  }

  await updateOpportunityAirtable(opportunityId);
  return modelOpportunityUser;
};

const updateOpportunityUser = async (opportunityUser) => {
  const modelOpportunityUser = await Opportunity_User.update(opportunityUser, {
    where: { id: opportunityUser.id },
    individualHooks: true,
    attributes: [
      'id',
      'UserId',
      'OpportunityId',
      'status',
      'bookmarked',
      'archived',
      'note',
      'seen',
      'recommended',
    ],
  }).then((model) => {
    return model && model.length > 1 && model[1][0];
  });

  await updateOpportunityAirtable(modelOpportunityUser.OpportunityId);

  return modelOpportunityUser;
};

const updateOpportunity = async (opportunity) => {
  const oldOpportunity = await getOpportunity(opportunity.id, true);

  const modelOpportunity = await Opportunity.update(opportunity, {
    where: { id: opportunity.id },
    include: INCLUDE_OPPORTUNITY_COMPLETE,
    individualHooks: true,
  }).then((model) => {
    return model && model.length > 1 && model[1][0];
  });

  if (opportunity.businessLines) {
    const businessLines = await Promise.all(
      opportunity.businessLines.map((name) => {
        return BusinessLine.findOrCreate({
          where: { name },
        }).then((model) => {
          return model[0];
        });
      })
    );
    await modelOpportunity.addBusinessLines(businessLines);
    await Opportunity_BusinessLine.destroy({
      where: {
        OpportunityId: opportunity.id,
        BusinessLineId: {
          [Op.not]: businessLines.map((bl) => {
            return bl.id;
          }),
        },
      },
    });
  }

  let newCandidatesIdsToSendMailTo;

  if (opportunity.candidatesId) {
    const t = await sequelize.transaction();
    try {
      const opportunitiesUser = await Promise.all(
        opportunity.candidatesId.map((candidatId) => {
          return Opportunity_User.findOrCreate({
            where: {
              OpportunityId: modelOpportunity.id,
              UserId: candidatId, // to rename in userId
            },
            transaction: t,
          }).then((model) => {
            return model[0];
          });
        })
      );

      if (opportunity.isPublic) {
        await Opportunity_User.update(
          {
            recommended: true,
          },
          {
            where: {
              id: opportunitiesUser.map((opportunityUser) => {
                return opportunityUser.id;
              }),
            },
            transaction: t,
          }
        );
        await Opportunity_User.update(
          {
            recommended: false,
          },
          {
            where: {
              OpportunityId: modelOpportunity.id,
              UserId: {
                [Op.not]: opportunitiesUser.map((opportunityUser) => {
                  return opportunityUser.UserId;
                }),
              },
            },
            transaction: t,
          }
        );
      } else {
        await Opportunity_User.destroy({
          where: {
            OpportunityId: modelOpportunity.id,
            UserId: {
              [Op.not]: opportunitiesUser.map((opportunityUser) => {
                return opportunityUser.UserId;
              }),
            },
          },
          transaction: t,
        });
      }

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // Check case where the opportunity has become private and has candidates, to see if there are any new candidates so send mail to
  const newCandidates =
    opportunity.candidatesId &&
    opportunity.candidatesId.length > 0 &&
    opportunity.candidatesId.filter((candidateId) => {
      return !oldOpportunity.userOpportunity.some((oldUserOpp) => {
        return candidateId === oldUserOpp.User.id;
      });
    });

  if (
    newCandidates &&
    newCandidates.length > 0 &&
    modelOpportunity.isValidated
  ) {
    newCandidatesIdsToSendMailTo = newCandidates;
  }

  const finalOpportunity = await getOpportunity(opportunity.id, true);

  let candidatesToSendMailTo;

  if (!finalOpportunity.isPublic && oldOpportunity) {
    // Case where the opportunity was not validated and has been validated, we send the mail to everybody
    if (!oldOpportunity.isValidated && finalOpportunity.isValidated) {
      candidatesToSendMailTo =
        finalOpportunity.userOpportunity &&
        finalOpportunity.userOpportunity.length > 0
          ? finalOpportunity.userOpportunity
          : null;
    } else if (newCandidatesIdsToSendMailTo) {
      // Case where the opportunity was already validated, and we just added new candidates to whom we have to send the mail
      candidatesToSendMailTo =
        finalOpportunity.userOpportunity &&
        finalOpportunity.userOpportunity.length > 0
          ? finalOpportunity.userOpportunity.filter((userOpp) => {
              return newCandidatesIdsToSendMailTo.includes(userOpp.User.id);
            })
          : null;
    }
  }

  try {
    await updateTable(finalOpportunity, finalOpportunity.userOpportunity);
    console.log('Updated table with modified offer.');
  } catch (err) {
    console.error(err);
    console.log('Failed to update table with modified offer.');
  }

  const sendJobOfferMails = (candidates) => {
    return Promise.all(
      candidates.map(async (candidat) => {
        const coach =
          candidat.User &&
          candidat.User.candidat &&
          candidat.User.candidat.coach
            ? candidat.User.candidat.coach
            : null;

        await addToWorkQueue({
          type: JOBS.JOB_TYPES.SEND_MAIL,
          toEmail: coach
            ? { to: candidat.User.email, cc: coach.email }
            : candidat.User.email,
          templateId: MAILJET_TEMPLATES.OFFER_RECEIVED,
          variables: {
            offer: _.omitBy(
              {
                ...finalOpportunity,
                contract: findContractType(finalOpportunity.contract)?.label,
              },
              _.isNil
            ),
            candidat,
          },
        });

        await addToWorkQueue(
          {
            type: JOBS.JOB_TYPES.REMINDER_OFFER,
            opportunityId: finalOpportunity.id,
            candidatId: candidat.User.id,
          },
          {
            delay:
              (process.env.OFFER_REMINDER_DELAY
                ? parseFloat(process.env.OFFER_REMINDER_DELAY, 10)
                : 5) *
              3600000 *
              24,
          }
        );
      })
    );
  };

  if (candidatesToSendMailTo && candidatesToSendMailTo.length > 0) {
    await sendJobOfferMails(candidatesToSendMailTo);
  }

  if (!oldOpportunity.isValidated && finalOpportunity.isValidated) {
    const listOfNames = finalOpportunity.userOpportunity.map((candidate) => {
      return candidate.User.firstName;
    });

    let stringOfNames = '';
    if (listOfNames.length === 0) {
      stringOfNames = 'Le candidat';
    } else {
      stringOfNames =
        listOfNames.length > 1
          ? `${listOfNames.slice(0, -1).join(', ')} et ${listOfNames.slice(-1)}`
          : listOfNames[0];
    }

    const mailjetVariables = {
      ..._.omitBy(
        {
          ...finalOpportunity,
          contract: findContractType(finalOpportunity.contract)?.label,
        },
        _.isNil
      ),
      candidates: stringOfNames,
      isPublicString: finalOpportunity.isPublic.toString(),
      candidatesLength: finalOpportunity.userOpportunity.length,
      businessLines: finalOpportunity.businessLines.join(', '),
    };

    await addToWorkQueue({
      type: JOBS.JOB_TYPES.SEND_MAIL,
      toEmail: finalOpportunity.recruiterMail,
      templateId: MAILJET_TEMPLATES.OFFER_VALIDATED,
      variables: mailjetVariables,
    });

    const adminMails = getAdminMailsFromDepartment(finalOpportunity.department);

    await addToWorkQueue({
      type: JOBS.JOB_TYPES.SEND_MAIL,
      toEmail: adminMails.candidates,
      templateId: MAILJET_TEMPLATES.OFFER_VALIDATED_ADMIN,
      variables: mailjetVariables,
    });
  }

  return finalOpportunity;
};

export {
  createOpportunity,
  deleteOpportunity,
  getOpportunity,
  getOpportunities,
  getPublicOpportunities,
  getPrivateUserOpportunities,
  getAllUserOpportunities,
  updateOpportunityUser,
  updateOpportunity,
  addUserToOpportunity,
  refreshAirtableOpportunities,
  getLatestOpportunities,
  getUnseenUserOpportunitiesCount,
  countPendingOpportunitiesCount,
};
