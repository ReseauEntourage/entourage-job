import { getUserOpportunityFromOffer } from 'src/utils/Filters';

import { col, Op, where } from 'sequelize';
import _ from 'lodash';

import {
  CV_FILTERS_DATA,
  MEMBER_FILTERS_DATA,
  OFFER_ADMIN_FILTERS_DATA,
  OFFER_CANDIDATE_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
} from 'src/constants';

// OFFER FILTERS
const filterCandidateOffersByType = (offers, type) => {
  let filteredList = offers;
  if (offers) {
    filteredList = filteredList.filter((offer) => {
      const isArchived =
        offer.userOpportunity && offer.userOpportunity.archived;
      switch (type) {
        case OFFER_CANDIDATE_FILTERS_DATA[0].tag:
          return true;
        case OFFER_CANDIDATE_FILTERS_DATA[1].tag:
          return !offer.isPublic && !isArchived;
        case OFFER_CANDIDATE_FILTERS_DATA[2].tag:
          return offer.isPublic && !isArchived;
        case OFFER_CANDIDATE_FILTERS_DATA[3].tag:
          return offer.userOpportunity && offer.userOpportunity.archived;
        default:
          return true;
      }
    });
  }

  return filteredList;
};

const filterAdminOffersByType = (offers, type) => {
  let filteredList = offers;
  if (offers) {
    filteredList = filteredList.filter((offer) => {
      switch (type) {
        case OFFER_ADMIN_FILTERS_DATA[0].tag:
          return true;
        case OFFER_ADMIN_FILTERS_DATA[1].tag:
          return !offer.isValidated && !offer.isArchived;
        case OFFER_ADMIN_FILTERS_DATA[2].tag:
          return offer.isValidated && !offer.isArchived;
        case OFFER_ADMIN_FILTERS_DATA[3].tag:
          return offer.isArchived;
        default:
          return true;
      }
    });
  }

  return filteredList;
};

const filterOffersByStatus = (offers, status, candidatId) => {
  let filteredList = offers;

  if (offers && status) {
    filteredList = offers.filter((offer) => {
      if (candidatId) {
        const userOpportunity = getUserOpportunityFromOffer(offer, candidatId);
        return userOpportunity
          ? status.some((currentFilter) => {
              return currentFilter.value === userOpportunity.status.toString();
            })
          : false;
      }
      return status.some((currentFilter) => {
        if (offer.userOpportunity && offer.userOpportunity.length > 0) {
          return offer.userOpportunity.some((userOpp) => {
            return currentFilter.value === userOpp.status.toString();
          });
        }

        return false;
      });
    });
  }

  return filteredList;
};

const getOfferOptions = (filtersObj) => {
  const whereOptions = {};

  if (filtersObj) {
    const keys = Object.keys(filtersObj);

    if (keys.length > 0) {
      const totalFilters = keys.reduce((acc, curr) => {
        return acc + filtersObj[curr].length;
      }, 0);

      if (totalFilters > 0) {
        for (let i = 0; i < keys.length; i += 1) {
          if (filtersObj[keys[i]].length > 0) {
            if (keys[i] === OPPORTUNITY_FILTERS_DATA[0].key) {
              whereOptions[keys[i]] = {
                [Op.or]: filtersObj[keys[i]].map((currentFilter) => {
                  return currentFilter.value === 'true';
                }),
              };
            } else {
              whereOptions[keys[i]] = {
                [Op.or]: filtersObj[keys[i]].map((currentFilter) => {
                  return currentFilter.value;
                }),
              };
            }
          }
        }
      }
    }
  }

  return whereOptions;
};

// CVS FILTERS
const getCVOptions = (filtersObj) => {
  const whereOptions = {};

  if (filtersObj) {
    const keys = Object.keys(filtersObj);

    if (keys.length > 0) {
      const totalFilters = keys.reduce((acc, curr) => {
        return acc + filtersObj[curr].length;
      }, 0);

      if (totalFilters > 0) {
        for (let i = 0; i < keys.length; i += 1) {
          if (filtersObj[keys[i]].length > 0) {
            if (keys[i] === CV_FILTERS_DATA[0].key) {
              whereOptions[keys[i]] = true;
            } else {
              whereOptions[keys[i]] = {
                [Op.or]: filtersObj[keys[i]].map((currentFilter) => {
                  return currentFilter.value;
                }),
              };
            }
          }
        }
      }
    }
  }

  return whereOptions;
};

// MEMBERS FILTERS
const getMemberOptions = (filtersObj) => {
  const whereOptions = {};

  if (filtersObj) {
    const keys = Object.keys(filtersObj);

    if (keys.length > 0) {
      const totalFilters = keys.reduce((acc, curr) => {
        return acc + filtersObj[curr].length;
      }, 0);

      if (totalFilters > 0) {
        for (let i = 0; i < keys.length; i += 1) {
          if (filtersObj[keys[i]].length > 0) {
            if (
              keys[i] === MEMBER_FILTERS_DATA[2].key ||
              keys[i] === MEMBER_FILTERS_DATA[3].key
            ) {
              whereOptions[keys[i]] = {
                [Op.or]: filtersObj[keys[i]].map((currentFilter) => {
                  return currentFilter.value === 'true';
                }),
              };
            } else if (keys[i] === MEMBER_FILTERS_DATA[1].key) {
              whereOptions[keys[i]] = {
                coach: filtersObj[keys[i]].map((currentFilter) => {
                  return where(
                    col(`coach.candidatId`),
                    currentFilter.value === 'true' ? Op.is : Op.not,
                    null
                  );
                }),
                candidat: filtersObj[keys[i]].map((currentFilter) => {
                  return where(
                    col(`candidat.coachId`),
                    currentFilter.value === 'true' ? Op.is : Op.not,
                    null
                  );
                }),
              };
            } else {
              whereOptions[keys[i]] = {
                [Op.or]: filtersObj[keys[i]].map((currentFilter) => {
                  return currentFilter.value;
                }),
              };
            }
          }
        }
      }
    }
  }

  return whereOptions;
};

const filterMembersByCVStatus = (members, status) => {
  let filteredList = members;

  if (members && status) {
    filteredList = members.filter((member) => {
      return status.some((currentFilter) => {
        if (member.candidat && member.candidat.cvs.length > 0) {
          return currentFilter.value === member.candidat.cvs[0].status;
        }
        return false;
      });
    });
  }

  return filteredList;
};

const filterMembersByAssociatedUser = (members, associatedUsers) => {
  let filteredList = members;

  if (members && associatedUsers && associatedUsers.length > 0) {
    filteredList = members.filter((member) => {
      return associatedUsers.some((currentFilter) => {
        if (member.candidat) {
          return !!member.candidat.coach === (currentFilter.value === 'true');
        }
        if (member.coach) {
          return !!member.coach.candidat === (currentFilter.value === 'true');
        }
        return !(currentFilter.value === 'true');
      });
    });
  }

  return filteredList;
};

// UTILS
const getFiltersObjectsFromQueryParams = (params, filtersConst) => {
  const filters = {};
  if (filtersConst) {
    _.forEach(Object.keys(params), (paramKey) => {
      if (
        filtersConst.find((filterData) => {
          return filterData.key === paramKey;
        })
      ) {
        const valueArray = params[paramKey];
        if (valueArray.length > 0) {
          filters[paramKey] = _.map(valueArray, (val) => {
            return { value: val };
          });
        }
      }
    });
  }
  return filters;
};

export {
  filterCandidateOffersByType,
  filterAdminOffersByType,
  filterOffersByStatus,
  getOfferOptions,
  getCVOptions,
  filterMembersByCVStatus,
  filterMembersByAssociatedUser,
  getMemberOptions,
  getFiltersObjectsFromQueryParams,
};
