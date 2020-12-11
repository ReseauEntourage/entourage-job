const { OFFER_STATUS, JOBS, AIRTABLE_NAMES } = require('../../constants');

const { findOfferStatus } = require('../../utils/Finding');

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

const createOpportunity = async (data) => {
  console.log(`createOpportunity - Création de l'opportunité`);

  console.log(`Etape 1 - Création de l'opportunité de base`);
  const modelOpportunity = await Opportunity.create(data);

  if (data.businessLines) {
    console.log(`Etape 2 - BusinessLine`);
    const businessLines = await Promise.all(
      data.businessLines.map((name) =>
        BusinessLine.findOrCreate({
          where: { name },
        }).then((model) => model[0])
      )
    );
    await modelOpportunity.addBusinessLines(businessLines);
  }

  let candidates = [];
  if (data.candidatesId && data.candidatesId.length > 0) {
    console.log(
      `Etape 4 - Détermine le(s) User(s) à qui l'opportunité s'adresse`
    );
    candidates = await Promise.all(
      data.candidatesId.map((candidatId) =>
        Opportunity_User.create({
          OpportunityId: modelOpportunity.id,
          UserId: candidatId, // to rename in userId
        }).then((model) => model[0])
      )
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

const getOpportunity = async (id) => {
  const model = await Opportunity.findByPk(id, {
    include: INCLUDE_OPPORTUNITY_COMPLETE,
  });
  return cleanOpportunity(model);
};

const getOpportunities = async (search) => {
  const options = {
    include: INCLUDE_OPPORTUNITY_COMPLETE_ADMIN,
  };
  if (search) {
    const lowerCaseSearch = search.toLowerCase();
    options.where = {
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
        where(fn('lower', col('Opportunity.company')), {
          [Op.like]: `%${lowerCaseSearch}%`,
        }),
      ],
    };
  }
  const opportunities = await Opportunity.findAll(options);

  return opportunities.map((model) => cleanOpportunity(model));
};

const getPublicOpportunities = async () => {
  const opportunities = await Opportunity.findAll({
    include: INCLUDE_OPPORTUNITY_COMPLETE,
    where: {
      isPublic: true,
      isValidated: true,
    },
  });

  return opportunities.map((model) => cleanOpportunity(model));
};

const getPrivateUserOpportunities = async (userId) => {
  console.log(`getOpportunities - Récupérer les opportunités`);
  const opportunityUsers = await Opportunity_User.findAll({
    where: { UserId: userId },
    attributes: ['OpportunityId'],
  });

  const opportunities = await Opportunity.findAll({
    include: INCLUDE_OPPORTUNITY_COMPLETE_ADMIN,
    where: {
      id: opportunityUsers.map((model) => model.OpportunityId),
    },
  });

  return opportunities.map((model) => cleanOpportunity(model));
};

const getAllUserOpportunities = async (userId) => {
  // private
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
          id: opportunityUsers.map((model) => model.OpportunityId),
          isPublic: false,
          isValidated: true,
        },
      ],
    },
  });

  const finalOpportunities = opportunities.map((model) => {
    const opportunity = cleanOpportunity(model);
    opportunity.userOpportunity = opportunity.userOpportunity.find(
      (uo) => uo.UserId === userId
    );
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

  return finalOpportunities;
};

const updateOpportunityAirtable = async (opportunityId) => {
  const finalOpportunity = await getOpportunity(opportunityId);

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

  await Promise.all(opportunities.map((opportunity) => updateOpportunityAirtable(opportunity.id)));
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
  }).then((model) => model && model.length > 1 && model[1][0]);

  await updateOpportunityAirtable(modelOpportunityUser.OpportunityId);

  return modelOpportunityUser;
};

const updateOpportunity = async (opportunity) => {
  const oldOpportunity = await getOpportunity(opportunity.id);

  const modelOpportunity = await Opportunity.update(opportunity, {
    where: { id: opportunity.id },
    include: INCLUDE_OPPORTUNITY_COMPLETE,
    individualHooks: true,
  }).then((model) => model && model.length > 1 && model[1][0]);

  if (opportunity.businessLines) {
    const businessLines = await Promise.all(
      opportunity.businessLines.map((name) =>
        BusinessLine.findOrCreate({
          where: { name },
        }).then((model) => model[0])
      )
    );
    await modelOpportunity.addBusinessLines(businessLines);
    await Opportunity_BusinessLine.destroy({
      where: {
        OpportunityId: opportunity.id,
        BusinessLineId: { [Op.not]: businessLines.map((bl) => bl.id) },
      },
    });
  }

  let newCandidatesIdsToSendMailTo;

  if (opportunity.isPublic) {
    // TODO do we want to delete the relations after changing from public to private ?
    /* await Opportunity_User.destroy({
      where: {
        OpportunityId: modelOpportunity.id,
      },
    }); */
  } else if (opportunity.candidatesId) {
    const opportunitiesUser = await Promise.all(
      opportunity.candidatesId.map((candidatId) =>
        Opportunity_User.findOrCreate({
          where: {
            OpportunityId: modelOpportunity.id,
            UserId: candidatId, // to rename in userId
          },
        }).then((model) => model[0])
      )
    );

    await Opportunity_User.destroy({
      where: {
        OpportunityId: modelOpportunity.id,
        UserId: {
          [Op.not]: opportunitiesUser.map(
            (opportunityUser) => opportunityUser.UserId
          ),
        },
      },
    });

    // Check case where the opportunity has become private and has candidates, to see if there are any new candidates so send mail to
    const newCandidates =
      opportunity.candidatesId &&
      opportunity.candidatesId.length > 0 &&
      opportunity.candidatesId.filter(
        (candidateId) =>
          !oldOpportunity.userOpportunity.some(
            (oldUserOpp) => candidateId === oldUserOpp.User.id
          )
      );

    if (
      newCandidates &&
      newCandidates.length > 0 &&
      modelOpportunity.isValidated
    ) {
      newCandidatesIdsToSendMailTo = newCandidates;
    }
  }

  const finalOpportunity = await getOpportunity(opportunity.id);

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
          ? finalOpportunity.userOpportunity.filter((userOpp) =>
              newCandidatesIdsToSendMailTo.includes(userOpp.User.id)
            )
          : null;
    }
  }

  const sendJobOfferMails = (candidates) => {
    return Promise.all(
      candidates.map(async (candidat) => {
        await addToWorkQueue({
          type: JOBS.JOB_TYPES.SEND_MAIL,
          toEmail: candidat.User.email,
          subject: `Vous avez reçu une nouvelle offre d'emploi`,
          text: `
            Vous venez de recevoir une nouvelle offre d'emploi : ${finalOpportunity.title} - ${finalOpportunity.company}.
            Vous pouvez la consulter en cliquant ici :
            ${process.env.SERVER_URL}/backoffice/candidat/offres?q=${finalOpportunity.id}.`,
        });

        const coach =
          candidat.User &&
          candidat.User.candidat &&
          candidat.User.candidat.coach
            ? candidat.User.candidat.coach
            : null;

        if (coach) {
          await addToWorkQueue({
            type: JOBS.JOB_TYPES.SEND_MAIL,
            toEmail: coach.email,
            subject: `${candidat.User.firstName} a reçu une nouvelle offre d'emploi`,
            text: `
           ${candidat.User.firstName} vient de recevoir une nouvelle offre d'emploi : ${finalOpportunity.title} - ${finalOpportunity.company}.
           Vous pouvez la consulter en cliquant ici :
           ${process.env.SERVER_URL}/backoffice/candidat/offres?q=${finalOpportunity.id}.`,
          });
        }
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
