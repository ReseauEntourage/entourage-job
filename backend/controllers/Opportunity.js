const {
  filterOffers,
  getFiltersObjectsFromQueryParams,
  filterCandidateOffersByType,
  filterAdminOffersByType,
} = require('../../utils/Filters');
const { OFFER_STATUS, JOBS, AIRTABLE_NAMES } = require('../../constants');

const {
  findOfferStatus,
  getAdminMailFromDepartment,
} = require('../../utils/Finding');

const { addToWorkQueue } = require('../jobs');

const offerTable = AIRTABLE_NAMES.OFFERS;

const {
  models: {
    BusinessLine,
    Opportunity_User,
    Opportunity_BusinessLine,
    Opportunity,
    User_Candidat,
    User,
  },
  Sequelize: { Op, fn, col, where },
} = require('../db/models');

const { cleanOpportunity } = require('../utils');

const { OPPORTUNITY_FILTERS_DATA } = require('../../constants');

const INCLUDE_OPPORTUNITY_CANDIDATE = [
  {
    model: User,
    attributes: ['id', 'email', 'firstName', 'lastName', 'gender'],
    include: [
      {
        model: User_Candidat,
        as: 'candidat',
        attributes: ['employed', 'hidden', 'note', 'url'],
        include: [
          {
            model: User,
            as: 'coach',
            attributes: ['id', 'email', 'firstName', 'lastName'],
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
        attributes: ['id', 'email', 'firstName', 'lastName', 'gender', 'email'],
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
    ],
  },
];

const getOfferSearchOptions = (search) => {
  if (search) {
    const lowerCaseSearch = search.toLowerCase();
    return {
      [Op.or]: [
        where(fn('lower', col('Opportunity.title')), {
          [Op.like]: `%${lowerCaseSearch}%`,
        }),
        where(fn('lower', col('Opportunity.recruiterName')), {
          [Op.like]: `%${lowerCaseSearch}%`,
        }),
        where(fn('lower', col('Opportunity.location')), {
          [Op.like]: `%${lowerCaseSearch}%`,
        }),
        where(fn('lower', col('Opportunity.department')), {
          [Op.like]: `%${lowerCaseSearch}%`,
        }),
        where(fn('lower', col('Opportunity.company')), {
          [Op.like]: `%${lowerCaseSearch}%`,
        }),
      ],
    };
  }
  return {};
};

const getAirtableOpportunityFields = (
  opportunity,
  candidates,
  businessLines
) => {
  const commonFields = {
    OpportunityId: opportunity.id,
    Titre: opportunity.title,
    Nom: opportunity.recruiterName,
    Mail: opportunity.recruiterMail,
    Téléphone: opportunity.recruiterPhone,
    Entreprise: opportunity.company,
    Localisation: opportunity.location,
    Description: opportunity.description,
    'Pré-requis': opportunity.prerequisites,
    "Secteur d'activité": businessLines,
    Publique: opportunity.isPublic,
    Validé: opportunity.isValidated,
    Archivé: opportunity.isArchived,
    'Date de création': opportunity.createdAt,
    Département: opportunity.department,
  };

  return candidates && candidates.length > 0
    ? [
        ...candidates.map((candidate) => {
          return {
            ...commonFields,
            OpportunityUserId: candidate.id,
            Candidat: `${candidate.User.firstName} ${candidate.User.lastName}`,
            Statut: findOfferStatus(candidate.status).label,
            Commentaire: candidate.note,
          };
        }),
        commonFields,
      ]
    : commonFields;
};

const updateTable = (opportunity, candidates) => {
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
          UserId: candidatId, // to rename in userId
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
    const adminMail = getAdminMailFromDepartment(finalOpportunity.department);

    await addToWorkQueue({
      type: JOBS.JOB_TYPES.SEND_MAIL,
      toEmail: adminMail,
      subject: `Nouvelle offre d'emploi`,
      text: `
    Une nouvelle offre d'emploi est en attente de validation : ${finalOpportunity.title} - ${finalOpportunity.company}.
    Vous pouvez la consulter en cliquant ici :
    ${process.env.SERVER_URL}/backoffice/admin/offres?q=${finalOpportunity.id}.
    `,
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
  const { search, ...restParams } = params;
  const options = {
    include: INCLUDE_OPPORTUNITY_COMPLETE_ADMIN,
    paranoid: false,
  };

  const searchOptions = getOfferSearchOptions(search);

  const opportunities = await Opportunity.findAll({
    ...options,
    where: {
      ...searchOptions,
    },
  });

  const { type, ...restFilters } = restParams;

  const cleanedOpportunites = opportunities.map((model) => {
    return cleanOpportunity(model);
  });

  const filteredTypeOpportunites = filterAdminOffersByType(
    cleanedOpportunites,
    type
  );

  return filterOffers(
    filteredTypeOpportunites,
    getFiltersObjectsFromQueryParams(restFilters, OPPORTUNITY_FILTERS_DATA)
  );
};

const getPublicOpportunities = async () => {
  const opportunities = await Opportunity.findAll({
    include: INCLUDE_OPPORTUNITY_COMPLETE,
    where: {
      isPublic: true,
      isValidated: true,
    },
  });

  return opportunities.map((model) => {
    return cleanOpportunity(model);
  });
};

const getPrivateUserOpportunities = async (userId, params) => {
  const { search, ...restParams } = params;
  const searchOptions = getOfferSearchOptions(search);

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
    },
  });

  const cleanedOpportunities = opportunities.map((model) => {
    return cleanOpportunity(model);
  });

  return filterOffers(
    cleanedOpportunities,
    getFiltersObjectsFromQueryParams(restParams, OPPORTUNITY_FILTERS_DATA),
    userId
  );
};

const getAllUserOpportunities = async (userId, params = {}) => {
  const { search, ...restParams } = params;
  const searchOptions = getOfferSearchOptions(search);

  const opportunityUsers = await Opportunity_User.findAll({
    where: { UserId: userId },
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
      ...searchOptions,
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
          if (a.userOpportunity.seen && !b.userOpportunity.seen) return -1;
          if (!a.userOpportunity.seen && b.userOpportunity.seen) return 1;
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

  const { type, ...restFilters } = restParams;

  const filteredTypeOpportunities = filterCandidateOffersByType(
    finalOpportunities,
    type
  );

  return filterOffers(
    filteredTypeOpportunities,
    getFiltersObjectsFromQueryParams(restFilters, OPPORTUNITY_FILTERS_DATA),
    userId
  );
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
  } catch (e) {
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
      }
    );
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

  if (opportunity.isPublic) {
    // TODO do we want to delete the relations after changing from public to private ?
    await Opportunity_User.destroy({
      where: {
        OpportunityId: modelOpportunity.id,
      },
    });
  } else if (opportunity.candidatesId) {
    const opportunitiesUser = await Promise.all(
      opportunity.candidatesId.map((candidatId) => {
        return Opportunity_User.findOrCreate({
          where: {
            OpportunityId: modelOpportunity.id,
            UserId: candidatId, // to rename in userId
          },
        }).then((model) => {
          return model[0];
        });
      })
    );

    await Opportunity_User.destroy({
      where: {
        OpportunityId: modelOpportunity.id,
        UserId: {
          [Op.not]: opportunitiesUser.map((opportunityUser) => {
            return opportunityUser.UserId;
          }),
        },
      },
    });

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
          subject: `Vous avez reçu une nouvelle offre d'emploi`,
          text: `
            Vous venez de recevoir une nouvelle offre d'emploi : ${finalOpportunity.title} - ${finalOpportunity.company}.
            Vous pouvez la consulter en cliquant ici :
            ${process.env.SERVER_URL}/backoffice/candidat/offres?q=${finalOpportunity.id}.`,
        });
      })
    );
  };

  try {
    await updateTable(finalOpportunity, finalOpportunity.userOpportunity);
    if (candidatesToSendMailTo && candidatesToSendMailTo.length > 0) {
      await sendJobOfferMails(candidatesToSendMailTo);
    }
    console.log(
      'Updated table with modified offer and sent mail to candidate and coach.'
    );
  } catch (err) {
    console.error(err);
    console.log(
      'Failed to update table with modified offer or send mail to candidate and coach.'
    );
  }

  return finalOpportunity;
};

module.exports = {
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
};
