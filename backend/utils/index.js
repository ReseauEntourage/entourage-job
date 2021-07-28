const {
  checkCandidatOrCoachAuthorization,
  checkUserAuthorization,
} = require('./RoleManagement');
const { escapeColumn, escapeQuery } = require('./DatabaseQueries');
const { cleanCV, cleanOpportunity, controlText } = require('./DataFormatting');
const { forceGC } = require('./GarbageCollector');

module.exports = {
  checkUserAuthorization,
  checkCandidatOrCoachAuthorization,
  escapeColumn,
  escapeQuery,
  cleanCV,
  cleanOpportunity,
  controlText,
  forceGC,
};
