/* eslint-disable no-restricted-globals */
/* eslint-disable camelcase */

const { findOfferStatus } = require('../../utils/Finding');

const { sendMail } = require('./mail');

const { airtable } = require('./airtable');

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
    include: [
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
    ],
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

const getAirtableOpportunityFields = (opportunity, candidat, businessLines) => {
  return {
    Id: opportunity.id,
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
    Candidat:
      !opportunity.isPublic && candidat
        ? `${candidat.firstName} ${candidat.lastName}`
        : null,
    Statut:
      !opportunity.isPublic &&
      opportunity.userOpportunity &&
      opportunity.userOpportunity.length > 0
        ? findOfferStatus(opportunity.userOpportunity[0].status).label
        : null,
    Validé: opportunity.isValidated,
    Archivé: opportunity.isArchived,
  };
};

const updateTable = (opportunity, candidat) =>
  new Promise((res, rej) => {
    airtable("Offres d'emploi v2")
      .select({
        filterByFormula: `{Id}='${opportunity.id}'`,
      })
      .firstPage((err, results) => {
        if (err) {
          return rej(err);
        }

        const fields = getAirtableOpportunityFields(
          opportunity,
          candidat,
          opportunity.businessLines
        );

        if (results.length === 0) {
          airtable("Offres d'emploi v2").create(
            [
              {
                fields,
              },
            ],
            (error, records) => {
              if (error) {
                return rej(error);
              }
              return res();
            }
          );
        } else {
          const record = results[0];

          // grab the record id
          // and then push an update to this record
          const record_id = record.id;
          airtable("Offres d'emploi v2").update(
            [
              {
                id: record_id,
                fields,
              },
            ],
            (error, records) => {
              if (error) {
                return rej(error);
              }
              return res();
            }
          );
        }
      });
  });

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

  let candidat = null;
  if (data.candidatId) {
    console.log(`Etape 4 - Détermine le User à qui l'opportunité s'adresse`);
    await Opportunity_User.create({
      OpportunityId: modelOpportunity.id,
      UserId: data.candidatId, // to rename in userId
    });
    candidat = await User.findByPk(data.candidatId);
  }

  console.log(`Etape finale - Reprendre l'opportunité complète à retourner`);

  const finalOpportunity = await Opportunity.findByPk(modelOpportunity.id, {
    include: INCLUDE_OPPORTUNITY_USER,
  });

  const cleanedOpportunity = cleanOpportunity(modelOpportunity);

  const fillTable = () =>
    new Promise((res, rej) => {
      const fields = getAirtableOpportunityFields(
        finalOpportunity,
        candidat,
        data.businessLines
      );
      airtable("Offres d'emploi v2").create(
        [
          {
            fields,
          },
        ],
        (err, records) => {
          if (err) {
            return rej(err);
          }
          return res();
        }
      );
    });

  try {
    await fillTable();
    console.log('Filled table with new offer.');
  } catch (err) {
    console.error(err);
    console.log('Failed to fill table with new offer.');
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

  return opportunities.map((model) => {
    const opportunity = cleanOpportunity(model);
    opportunity.userOpportunity = opportunity.userOpportunity.find(
      (uo) => uo.UserId === userId
    );
    if (!opportunity.userOpportunity) {
      delete opportunity.userOpportunity;
    }
    return opportunity;
  });
};

const addUserToOpportunity = (opportunityId, userId) =>
  Opportunity_User.create({
    OpportunityId: opportunityId,
    UserId: userId, // to rename in userId
  });

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

  const finalOpportunity = await getOpportunity(
    modelOpportunityUser.OpportunityId
  );

  const candidat =
    finalOpportunity.userOpportunity &&
    finalOpportunity.userOpportunity.length > 0
      ? finalOpportunity.userOpportunity[0].User
      : null;

  try {
    await updateTable(finalOpportunity, candidat);
  } catch (e) {
    console.log('Failed to update table with modified offer.');
  }

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

  let shouldSendMail = false;

  if (opportunity.isPublic) {
    await Opportunity_User.destroy({
      where: {
        OpportunityId: modelOpportunity.id,
      },
    });
  } else if (opportunity.candidatId) {
    const opportunityUser = await Opportunity_User.findOrCreate({
      where: {
        OpportunityId: modelOpportunity.id,
        UserId: opportunity.candidatId, // to rename in userId
      },
    }).then((model) => model[0]);

    // suppression des secteurs d'activité non inclus dans les liens user->opportunité
    await Opportunity_User.destroy({
      where: {
        OpportunityId: modelOpportunity.id,
        UserId: { [Op.not]: opportunityUser.UserId },
      },
    });

    const previousCandidat =
      oldOpportunity.userOpportunity &&
      oldOpportunity.userOpportunity.length > 0
        ? oldOpportunity.userOpportunity[0].User
        : null;

    if (
      !previousCandidat ||
      (previousCandidat.id !== opportunity.candidatId &&
        modelOpportunity.isValidated)
    ) {
      shouldSendMail = true;
    }
  }

  const finalOpportunity = await getOpportunity(opportunity.id);

  if (
    oldOpportunity &&
    !oldOpportunity.isValidated &&
    finalOpportunity.isValidated &&
    !finalOpportunity.isPublic
  ) {
    shouldSendMail = true;
  }

  const candidat =
    finalOpportunity.userOpportunity &&
    finalOpportunity.userOpportunity.length > 0
      ? finalOpportunity.userOpportunity[0].User
      : null;

  const sendJobOfferMails = async () => {
    if (candidat) {
      await sendMail({
        toEmail: candidat.email,
        subject: `Vous avez reçu une nouvelle offre d'emploi`,
        text: `
          Vous venez de recevoir une nouvelle offre d'emploi : ${finalOpportunity.title} - ${finalOpportunity.company}.
          Vous pouvez la consulter en cliquant ici :
          ${process.env.SERVER_URL}/backoffice/candidat/offres?q=${finalOpportunity.id}.`,
      });

      const coach =
        candidat && candidat.candidat && candidat.candidat.coach
          ? candidat.candidat.coach
          : null;

      if (coach) {
        await sendMail({
          toEmail: coach.email,
          subject: `${candidat.firstName} a reçu une nouvelle offre d'emploi`,
          text: `
         ${candidat.firstName} vient de recevoir une nouvelle offre d'emploi : ${finalOpportunity.title} - ${finalOpportunity.company}.
         Vous pouvez la consulter en cliquant ici :
         ${process.env.SERVER_URL}/backoffice/candidat/offres?q=${finalOpportunity.id}.`,
        });
      }
    }
  };

  try {
    await updateTable(finalOpportunity, candidat);
    if (shouldSendMail) await sendJobOfferMails();
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
};
