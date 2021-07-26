const _ = require('lodash');
const { OPPORTUNITY_FILTERS_DATA } = require('../../constants');

const getFiltersObjectsFromQueryParams = (params) => {
  const filters = {};
  _.forEach(Object.keys(params), (paramKey) => {
    if (
      OPPORTUNITY_FILTERS_DATA.find((filterData) => {
        return filterData.key === paramKey;
      })
    ) {
      const valueArray = params[paramKey];
      if (valueArray.length > 0) {
        filters[paramKey] = valueArray.map((val) => {
          return { value: val };
        });
      }
    }
  });
  return filters;
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
              const userOpportunity = getUserOpportunityFromOffer(
                offer,
                candidatId
              );
              hasFound = filtersObj[keys[i]].some((currentFilter) => {
                return (
                  currentFilter.value === userOpportunity.status.toString()
                );
              });
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

module.exports = {
  filterOffers,
  getUserOpportunityFromOffer,
  getFiltersObjectsFromQueryParams,
};
