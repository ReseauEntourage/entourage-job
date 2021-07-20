const { DEPARTMENTS, ADMIN_ZONES } = require('../constants/departements');
const { OFFER_STATUS } = require('../constants');

const findOfferStatus = (status) => {
  const currentStatus = OFFER_STATUS.find((oStatus) => {
    return oStatus.value === status;
  });
  if (currentStatus) return currentStatus;
  return { label: 'Non défini', color: 'muted' };
};

const getUserOpportunityFromOffer = (offer, candidatId) => {
  let userOpportunity;
  if (offer.userOpportunity && offer.userOpportunity.length > 0) {
    userOpportunity = offer.userOpportunity.find((userOpp) => {
      return userOpp.UserId === candidatId;
    });
  }
  return userOpportunity;
};

const getZoneFromDepartment = (dep) => {
  const zone = DEPARTMENTS.find((depObj) => {
    return depObj.name === dep;
  });
  return zone ? zone.zone : ADMIN_ZONES.HZ;
};

const getAdminMailFromDepartment = (dep) => {
  const zone = getZoneFromDepartment(dep);
  return process.env[`ADMIN_${zone}`];
};

module.exports = {
  findOfferStatus,
  getUserOpportunityFromOffer,
  getAdminMailFromDepartment,
};
