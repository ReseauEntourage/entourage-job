/* eslint-disable no-restricted-globals */
/* eslint-disable camelcase */

const {
  models: {
    BusinessLine,
    Opportunity_User,
    Opportunity_BusinessLine,
    Opportunity,
    User,
  },
  Sequelize: { Op, fn, col, where },
} = require('../db/models');
const { cleanOpportunity, controlText } = require('./tools');

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
  },
];

const createOpportunity = async (data) => {
  console.log(`createOpportunity - Création de l'opportunité`);

  console.log(`Etape 1 - Création de l'opportunité de base`);
  const modelOpportunity = await Opportunity.create(data);

  if (data.businessLines) {
    console.log(`Etape 2 - BusinessLine`);
    const businessLines = await Promise.all(
      data.businessLines.map((name) =>
        BusinessLine.findOrCreate({
          where: { name: controlText(name) },
        }).then((model) => model[0])
      )
    );
    modelOpportunity.addBusinessLines(businessLines);
  }

  if (data.usersId) {
    console.log(`Etape 4 - Déterminer les Users à qui l'opportunité s'adresse`);
    data.usersId.forEach((userId) =>
      Opportunity_User.create({
        OpportunityId: modelOpportunity.id,
        UserId: userId, // to rename in userId
      })
    );
  }

  console.log(`Etape finale - Reprendre l'opportunité complète à retourner`);

  return cleanOpportunity(modelOpportunity);
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
    include: [
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
            ],
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
    ],
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
    include: INCLUDE_OPPORTUNITY_COMPLETE,
    where: {
      id: opportunityUsers.map((model) => model.OpportunityId),
      isPublic: false,
      isValidated: true,
    },
  });
  return opportunities.map((model) => {
    const opportunity = cleanOpportunity(model);
    opportunity.userOpportunity = opportunity.userOpportunity.find(
      ({ UserId }) => UserId === userId
    );
    return opportunity;
  });
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
  await Opportunity_User.update(opportunityUser, {
    where: { id: opportunityUser.id },
    individualHooks: true,
  });
  return Opportunity_User.findByPk(opportunityUser.id, {
    attributes: [
      'id',
      'UserId',
      'status',
      'bookmarked',
      'archived',
      'note',
      'seen',
    ],
  });
};

const updateOpportunity = async (opportunity) => {
  await Opportunity.update(opportunity, {
    where: { id: opportunity.id },
  });

  const modelOpportunity = await Opportunity.findByPk(opportunity.id, {
    include: INCLUDE_OPPORTUNITY_COMPLETE,
  });
  if (opportunity.businessLines) {
    await Opportunity_BusinessLine.destroy({
      where: {
        OpportunityId: opportunity.id,
      },
      truncate: true,
    });
    const businessLines = await Promise.all(
      opportunity.businessLines.map((name) =>
        BusinessLine.findOrCreate({
          where: { name: controlText(name) },
        }).then((model) => model[0])
      )
    );
    await modelOpportunity.addBusinessLines(businessLines);
  }

  if (opportunity.usersId) {
    // Les liens entre user et opportunites qui ne seront plus present apres update
    const differenceId = modelOpportunity.userOpportunity
      .filter(({ UserId }) => !opportunity.usersId.includes(UserId))
      .map(({ id }) => id);

    // // suppression des secteurs d'activité non inclus dans les liens user->opportunité
    // await Opportunity_BusinessLine.destroy({
    //   where: {
    //     OpportunityId: differenceId,
    //   },
    //   truncate: true,
    // });
    await Opportunity_User.destroy({
      where: {
        id: differenceId,
      },
      truncate: true,
    });
    await Promise.all(
      opportunity.usersId.map((userId) =>
        Opportunity_User.findOrCreate({
          where: {
            OpportunityId: modelOpportunity.id,
            UserId: userId, // to rename in userId
          },
        })
      )
    );
  }

  return getOpportunity(opportunity.id);
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
