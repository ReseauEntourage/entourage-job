const {
    startTestServer,
    stopTestServer,
    recreateTestDB,
    resetTestDB,
    createEntities,
    getApp,
} = require('./helpers');

const createCvWithAssociations = require('./cv.helpers');

const {
    createLoggedInUser,
    getTokenAndId,
} = require('./user.helpers');

const {
    associateCoachAndCandidat,
    getCandidatAndCoach,
    getCandidatUrl,
} = require('./user_candidat.helpers');

const associateOpportunityUser = require('./opportunity_user.helpers');

module.exports = {
    startTestServer,
    stopTestServer,
    recreateTestDB,
    resetTestDB,
    createEntities,
    getApp,

    createCvWithAssociations,
    createLoggedInUser,
    getTokenAndId,

    associateCoachAndCandidat,
    getCandidatAndCoach,
    getCandidatUrl,

    associateOpportunityUser,
}