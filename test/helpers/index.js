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

const {
    associateOpportunityUser,
    associateManyOpportunitiesUser,
} = require('./opportunity_user.helpers');

const getResetLinkAndUser = require('./auth.helpers');

const {
    getTestImagePath
} = require('./cvImage.helpers');

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
    associateManyOpportunitiesUser,

    getResetLinkAndUser,

    getTestImagePath
}
