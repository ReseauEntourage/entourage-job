import { ADMIN_ZONES, DEPARTMENTS } from 'src/constants/departements';
import { OFFER_STATUS } from 'src/constants';

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
  return zone && zone.zone !== ADMIN_ZONES.HZ ? zone.zone : 'HZ';
};

const getAdminMailFromDepartment = (dep) => {
  const zone = getZoneFromDepartment(dep);
  return process.env[`ADMIN_${zone}`];
};

export { findOfferStatus, getAdminMailFromDepartment };
