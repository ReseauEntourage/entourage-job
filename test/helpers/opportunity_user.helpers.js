const {
  models: { Opportunity_User },
} = require('../../backend/db/models');

/**
 * Create an association between a user and an opportunity
 *
 * @param {string} opportunityId must exist in DB
 * @param {string} userId must exist in DB
 * @returns {Objet<Opportunity_User>} model
 */
const associateOpportunityUser = async (opportunityId, userId) => {
  await Opportunity_User.create({
    OpportunityId: opportunityId,
    UserId: userId,
  });
  const res = await Opportunity_User.findOne({
    where: {
      OpportunityId: opportunityId,
      UserId: userId,
    },
  });

  return res.dataValues;
};

/**
 * Associate many opportunities to a user
 *
 * @param {Array<string>} opportunitiesId id of the opportunities to
 * associate to a user
 * @param {string} userId id of the user
 */
const associateManyOpportunitiesUser = async (opportunitiesId, userId) => {
  const opportunitiesUser = [];
  for (let i = 0; i < opportunitiesId.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const opp = await associateOpportunityUser(opportunitiesId[i], userId);
    opportunitiesUser.push(opp);
  }

  return opportunitiesUser;
};
module.exports = {
  associateOpportunityUser,
  associateManyOpportunitiesUser,
};
