const {
    models: {
        // eslint-disable-next-line camelcase
        Opportunity_User,
    }
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
        }
    });

    return res.dataValues;
}

module.exports = associateOpportunityUser;