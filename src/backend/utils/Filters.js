import { getUserOpportunityFromOffer } from 'src/utils/Filters';

import { Op } from 'sequelize';
import _ from 'lodash';

import {
  CV_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
  OFFER_CANDIDATE_FILTERS_DATA,
  OFFER_ADMIN_FILTERS_DATA,
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

const filterOffers = (offers, filtersObj, candidatId) => {
  let filteredList = offers;

  if (offers && filtersObj) {
    const keys = Object.keys(filtersObj);

    if (keys.length > 0) {
      const totalFilters = keys.reduce((acc, curr) => {
        return acc + filtersObj[curr].length;
      }, 0);

      if (totalFilters > 0) {
        filteredList = offers.filter((offer) => {
          // TODO make generic if several filters
          const resultForEachFilter = [];
          for (let i = 0; i < keys.length; i += 1) {
            let hasFound = false;
            if (filtersObj[keys[i]].length === 0) {
              hasFound = true;
            } else if (keys[i] === OPPORTUNITY_FILTERS_DATA[0].key) {
              hasFound = offer.isPublic;
            } else if (keys[i] === OPPORTUNITY_FILTERS_DATA[1].key) {
              if (candidatId) {
                const userOpportunity = getUserOpportunityFromOffer(
                  offer,
                  candidatId
                );
                hasFound = userOpportunity
                  ? filtersObj[keys[i]].some((currentFilter) => {
                      return (
                        currentFilter.value ===
                        userOpportunity.status.toString()
                      );
                    })
                  : false;
              } else {
                hasFound = filtersObj[keys[i]].some((currentFilter) => {
                  if (
                    offer.userOpportunity &&
                    offer.userOpportunity.length > 0
                  ) {
                    return offer.userOpportunity.some((userOpp) => {
                      return currentFilter.value === userOpp.status.toString();
                    });
                  }

                  return false;
                });
              }
            } else if (keys[i] === OPPORTUNITY_FILTERS_DATA[2].key) {
              const deptFilters = filtersObj[keys[i]]
                .map((filter) => {
                  return filter.value;
                })
                .join();
              hasFound = deptFilters.includes(offer.department);
            }
            resultForEachFilter.push(hasFound);
          }

          return resultForEachFilter.every((value) => {
            return value;
          });
        });
      }
    }
  }

  return filteredList;
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
  filterOffers,
  filterCandidateOffersByType,
  filterAdminOffersByType,
  getCVOptions,
  getFiltersObjectsFromQueryParams,
};
