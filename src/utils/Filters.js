import { col, Op, where } from 'sequelize';
import _ from 'lodash';

import {
  MEMBER_FILTERS_DATA,
  OFFER_ADMIN_FILTERS_DATA,
  OFFER_CANDIDATE_FILTERS_DATA,
} from 'src/constants';
import {
  getCandidateFromCoachOrCandidate,
  getRelatedUser,
} from 'src/utils/Finding';

export const getUserOpportunityFromOffer = (offer, candidatId) => {
  let userOpportunity;
  if (offer.userOpportunity && Array.isArray(offer.userOpportunity)) {
    userOpportunity = offer.userOpportunity.find((userOpp) => {
      return userOpp.UserId === candidatId;
    });
  } else {
    userOpportunity = offer.userOpportunity;
  }
  return userOpportunity;
};

// OFFER FILTERS
const filterCandidateOffersByType = (offers, type) => {
  let filteredList = offers;
  if (offers) {
    filteredList = filteredList.filter((offer) => {
      const isArchived =
        offer.userOpportunity && offer.userOpportunity.archived;

      switch (type) {
        case OFFER_CANDIDATE_FILTERS_DATA[0].tag:
          return !offer.isPublic && !isArchived;
        case OFFER_CANDIDATE_FILTERS_DATA[1].tag:
          return offer.isPublic && !isArchived;
        case OFFER_CANDIDATE_FILTERS_DATA[2].tag:
          return isArchived;
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
          return !offer.isValidated && !offer.isArchived && !offer.isExternal;
        case OFFER_ADMIN_FILTERS_DATA[1].tag:
          return offer.isValidated && !offer.isArchived && !offer.isExternal;
        case OFFER_ADMIN_FILTERS_DATA[2].tag:
          return offer.isExternal;
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
              return currentFilter.value === userOpportunity.status;
            })
          : false;
      }
      return status.some((currentFilter) => {
        if (offer.userOpportunity && offer.userOpportunity.length > 0) {
          return offer.userOpportunity.some((userOpp) => {
            return currentFilter.value === userOpp.status;
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
            whereOptions[keys[i]] = {
              [Op.or]: filtersObj[keys[i]].reduce((acc, currentFilter) => {
                if (currentFilter) {
                  if (currentFilter.children) {
                    return [...acc, ...currentFilter.children];
                  }
                  return [...acc, currentFilter.value];
                }
                return [...acc];
              }, []),
            };
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
              keys[i] === MEMBER_FILTERS_DATA[3].key ||
              keys[i] === MEMBER_FILTERS_DATA[4].key
            ) {
              whereOptions[keys[i]] = {
                [Op.or]: filtersObj[keys[i]].map((currentFilter) => {
                  return currentFilter.value;
                }),
              };
            } else if (keys[i] === MEMBER_FILTERS_DATA[2].key) {
              // These options don't work
              whereOptions[keys[i]] = {
                coach: filtersObj[keys[i]].map((currentFilter) => {
                  return where(
                    col(`coach.candidatId`),
                    currentFilter.value ? Op.is : Op.not,
                    null
                  );
                }),
                candidat: filtersObj[keys[i]].map((currentFilter) => {
                  return where(
                    col(`candidat.coachId`),
                    currentFilter.value ? Op.is : Op.not,
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

const filterMembersByBusinessLines = (members, businessLines) => {
  let filteredList = members;

  if (members && businessLines && businessLines.length > 0) {
    filteredList = members.filter((member) => {
      return businessLines.some((currentFilter) => {
        if (member.candidat && member.candidat.cvs.length > 0) {
          const cvBusinessLines = member.candidat.cvs[0].businessLines;
          return (
            cvBusinessLines &&
            cvBusinessLines.length > 0 &&
            cvBusinessLines
              .map(({ name }) => {
                return name;
              })
              .includes(currentFilter.value)
          );
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
        const candidate = getCandidateFromCoachOrCandidate(member);
        const relatedUser = getRelatedUser(member);
        if (!candidate) {
          return !currentFilter.value;
        }
        return !!relatedUser === currentFilter.value;
      });
    });
  }

  return filteredList;
};

// TODO use zone if no departments

// UTILS
const getFiltersObjectsFromQueryParams = (params, filtersConst) => {
  const filters = {};
  if (filtersConst) {
    _.forEach(Object.keys(params), (paramKey) => {
      const filter = filtersConst.find((filterData) => {
        return filterData.key === paramKey;
      });
      if (filter) {
        const valueArray = params[paramKey];
        if (valueArray.length > 0) {
          filters[paramKey] = _.map(valueArray, (val) => {
            return filter.constants.find((constantValue) => {
              return constantValue.value.toString() === val;
            });
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
  filterMembersByBusinessLines,
  getMemberOptions,
  getFiltersObjectsFromQueryParams,
};
