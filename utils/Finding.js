const { DEPARTMENTS, ADMIN_ZONES } = require('../constants/departements');
const { OFFER_STATUS } = require('../constants');

const findOfferStatus = (status) => {
  const currentStatus = OFFER_STATUS.find((oStatus) => {
    return oStatus.value === status;
  });
  if (currentStatus) return currentStatus;
  return { label: 'Non défini', color: 'muted' };
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
  getAdminMailFromDepartment,
};
