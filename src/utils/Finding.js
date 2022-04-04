import { ADMIN_ZONES, DEPARTMENTS } from 'src/constants/departements';
import { OFFER_STATUS, USER_ROLES } from 'src/constants';

const findOfferStatus = (status, isPublic, isRecommended) => {
  const currentStatus = OFFER_STATUS.find((oStatus) => {
    return oStatus.value === status;
  });
  if (currentStatus) {
    if (isPublic) {
      if (isRecommended && currentStatus.recommended) {
        return {
          label: currentStatus.recommended,
          value: currentStatus.value,
          color: currentStatus.color,
        };
      }
      if (currentStatus.public) {
        return {
          label: currentStatus.public,
          value: currentStatus.value,
          color: currentStatus.color,
        };
      }
    }
    return {
      label: currentStatus.label,
      value: currentStatus.value,
      color: currentStatus.color,
    };
  }
  return { label: 'Non défini', color: 'muted' };
};

const findConstantFromValue = (valToFind, constantsToFindFrom) => {
  return (
    constantsToFindFrom.find(({ value }) => {
      return value === valToFind;
    }) || {
      label: valToFind,
      value: valToFind,
    }
  );
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
const getRelatedUser = (member) => {
  if (member) {
    if (member.candidat && member.candidat.coach) {
      return member.candidat.coach;
    }
    if (member.coach && member.coach.candidat) {
      return member.coach.candidat;
    }
  }

  return null;
};

const getCandidateFromCoachOrCandidate = (member) => {
  if (member) {
    if (member.role === USER_ROLES.CANDIDAT) {
      return member.candidat;
    }

    if (member.role === USER_ROLES.COACH) {
      return member.coach;
    }
  }
  return null;
};

const getCandidateIdFromCoachOrCandidate = (member) => {
  if (member) {
    if (member.role === USER_ROLES.CANDIDAT) {
      return member.id;
    }

    if (
      member.role === USER_ROLES.COACH &&
      member.coach &&
      member.coach.candidat
    ) {
      return member.coach.candidat;
    }
  }
  return null;
};

export {
  findOfferStatus,
  getAdminMailsFromDepartment,
  getZoneFromDepartment,
  getZoneSuffix,
  findConstantFromValue,
  getCandidateFromCoachOrCandidate,
  getCandidateIdFromCoachOrCandidate,
  getRelatedUser,
};
