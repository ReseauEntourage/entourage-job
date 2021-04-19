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

module.exports = {
  findOfferStatus,
  getUserOpportunityFromOffer,
};
