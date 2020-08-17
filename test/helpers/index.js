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
} = require('./user_candidat.helpers')

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
}