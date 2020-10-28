const { OFFER_STATUS } = require('../constants');

const findOfferStatus = (status) => {
  const currentStatus = OFFER_STATUS.find(
    (oStatus) => oStatus.value === status
  );
  if (currentStatus) return currentStatus;
  return { label: 'Non défini', color: 'muted' };
};

module.exports = {
  findOfferStatus,
};
