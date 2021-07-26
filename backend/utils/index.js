const {
  checkCandidatOrCoachAuthorization,
  checkUserAuthorization,
} = require('./RoleManagement');
const { escapeColumn, escapeQuery } = require('./DatabaseQueries');
const { cleanCV, cleanOpportunity, controlText } = require('./DataFormatting');
const { forceGC } = require('./GarbageCollector');
const { filterOffers, getUserOpportunityFromOffer } = require('./Filters');

module.exports = {
  checkUserAuthorization,
  checkCandidatOrCoachAuthorization,
  escapeColumn,
  escapeQuery,
  cleanCV,
  cleanOpportunity,
  controlText,
  forceGC,
  filterOffers,
  getUserOpportunityFromOffer,
};
