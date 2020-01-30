/* eslint-disable no-restricted-globals */

const { models } = require('../db/models');
const { cleanOpportunity, controlText } = require('./tools');

const INCLUDE_OPPORTUNITY_COMPLETE = [
  {
    model: models.BusinessLine,
    as: 'businessLines',
    attributes: ['name'],
    through: { attributes: [] },
  },
  {
    model: models.Opportunity_User,
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
    // through: {
    // },
  },
];

const createOpportunity = async (data) => {
  console.log(`createOpportunity - Création de l'opportunité`);

  console.log(`Etape 1 - Création de l'opportunité de base`);
  const modelOpportunity = await models.Opportunity.create(data);

  if (data.businessLines) {
    console.log(`Etape 2 - BusinessLine`);
    const businessLines = await Promise.all(
      data.businessLines.map((name) =>
        models.BusinessLine.findOrCreate({
          where: { name: controlText(name) },
        }).then((model) => model[0])
      )
    );
    modelOpportunity.addBusinessLines(businessLines);
  }

  if (data.usersId) {
    console.log(`Etape 4 - Déterminer les Users à qui l'opportunité s'adresse`);
    data.usersId.forEach((userId) =>
      models.Opportunity_User.create({
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
  return models.Opportunity.destroy({
    where: { id },
  });
};

const getOpportunity = async (id) => {
  const model = await models.Opportunity.findByPk(id, {
    include: INCLUDE_OPPORTUNITY_COMPLETE,
  });
  return cleanOpportunity(model);
};

const getOpportunities = async (category) => {
  const opportunities = await models.Opportunity.findAll({
    include: INCLUDE_OPPORTUNITY_COMPLETE,
    where: {
      category,
    },
  });

  return opportunities.map((model) => cleanOpportunity(model));
};
// private: category='Private'
// public: category='Public'
// all: category=undefined
const getUserOpportunities = async (userId, category = undefined) => {
  console.log(`getOpportunities - Récupérer les opportunités`);
  const opportunityUsers = await models.Opportunity_User.findAll({
    where: { UserId: userId },
    attributes: ['OpportunityId'],
  });
  const where = {
    id: opportunityUsers.map((model) => model.OpportunityId),
  };
  if (category !== undefined) {
    where.category = category;
  }

  // recupere trop de donné ( sur les autre utilisateurs)
  const opportunities = await models.Opportunity.findAll({
    include: INCLUDE_OPPORTUNITY_COMPLETE,
    where,
  });
  return opportunities.map((model) => {
    const opportunity = cleanOpportunity(model);
    opportunity.userOpportunity = opportunity.userOpportunity.find(
      (uo) => uo.UserId === userId
    );
    return opportunity;
  });
};

const addUserToOpportunity = (opportunityId, userId) =>
  models.Opportunity_User.create({
    OpportunityId: opportunityId,
    UserId: userId, // to rename in userId
  });

const updateOpportunity = (opportunity) => {
  return models.CV.update(opportunity, {
    where: { id: opportunity.id },
  });
};

const updateOpportunityUser = (opportunityUser) =>
  models.Opportunity_User.update(opportunityUser, {
    where: { id: opportunityUser.id },
  });

module.exports = {
  createOpportunity,

  deleteOpportunity,

  getOpportunity,
  getOpportunities,
  getUserOpportunities,

  updateOpportunityUser,
  updateOpportunity,

  addUserToOpportunity,
};
