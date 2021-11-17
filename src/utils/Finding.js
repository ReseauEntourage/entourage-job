import { ADMIN_ZONES, DEPARTMENTS } from 'src/constants/departements';
import { CONTRACTS, OFFER_STATUS } from 'src/constants';

const findOfferStatus = (status) => {
  const currentStatus = OFFER_STATUS.find((oStatus) => {
    return oStatus.value === status;
  });
  if (currentStatus) return currentStatus;
  return { label: 'Non défini', color: 'muted' };
};

const findContractType = (type) => {
  return CONTRACTS.find((contract) => {
    return contract.value === type;
  });
};

const getZoneSuffix = (zone) => {
  return zone && zone !== ADMIN_ZONES.HZ ? zone : 'HZ';
};

const getZoneFromDepartment = (dep) => {
  const zone = DEPARTMENTS.find((depObj) => {
    return depObj.name === dep;
  });
  return getZoneSuffix(zone ? zone.zone : null);
};

const getAdminMailsFromDepartment = (dep) => {
  const zone = getZoneFromDepartment(dep);
  return {
    candidates: process.env[`ADMIN_CANDIDATES_${zone}`],
    companies: process.env[`ADMIN_COMPANIES_${zone}`],
  };
};

export {
  findOfferStatus,
  getAdminMailsFromDepartment,
  getZoneSuffix,
  findContractType,
};
