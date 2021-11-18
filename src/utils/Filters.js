import _ from 'lodash';

const getUserOpportunityFromOffer = (offer, candidatId) => {
  let userOpportunity;
  if (
    offer.userOpportunity &&
    Array.isArray(offer.userOpportunity) &&
    offer.userOpportunity.length > 0
  ) {
    userOpportunity = offer.userOpportunity.find((userOpp) => {
      return userOpp.UserId === candidatId;
    });
  } else {
    userOpportunity = offer.userOpportunity;
  }
  return userOpportunity;
};

const getChildrenFilters = (filters) => {
  return filters.reduce((acc, curr) => {
    const accToReturn = [...acc];
    if (curr.children && curr.children.length > 0) {
      return [...accToReturn, ...getChildrenFilters(curr.children)];
    }
    return [
      ...accToReturn,
      {
        value: curr.value,
        label: curr.label,
      },
    ];
  }, []);
};

const getAllFilters = (filters, zone) => {
  const filtersToShow = filters.reduce((acc, curr) => {
    const accToReturn = [
      ...acc,
      {
        value: curr.value,
        label: curr.label,
        zone: curr.zone,
      },
    ];
    if (curr.children && curr.children.length > 0) {
      return [...accToReturn, ...getAllFilters(curr.children)];
    }
    return accToReturn;
  }, []);

  if (zone) {
    return filtersToShow.filter((filter) => {
      return !filter.zone || filter.zone === zone;
    });
  }

  return filtersToShow;
};

const findFilter = (filters, value) => {
  return filters.reduce((acc, curr) => {
    if (!acc || acc.value !== value) {
      if (curr.value !== value) {
        if (curr.children && curr.children.length > 0) {
          return findFilter(curr.children, value);
        }
        return null;
      }
      return curr;
    }
    return acc;
  }, null);
};

const initializeFilters = (filtersConst, defaults) => {
  let hasDefaults = false;
  if (defaults && Object.keys(defaults).length > 0) {
    hasDefaults = true;
  }
  return filtersConst.reduce((acc, curr) => {
    if (hasDefaults && defaults[curr.key]) {
      acc[curr.key] = defaults[curr.key];
    } else {
      acc[curr.key] = [];
    }
    return acc;
  }, {});
};

const filtersToQueryParams = (filters) => {
  const params = {};
  _.forEach(Object.keys(filters), (filter) => {
    params[filter] =
      filters[filter].length > 0
        ? filters[filter].map((f) => {
            return f.value;
          })
        : undefined;
  });
  return params;
};

const getFiltersObjectsFromQueryParamsFront = (params, filtersConst) => {
  const filters = {};
  if (filtersConst) {
    _.forEach(filtersConst, (filterConst) => {
      if (params[filterConst.key] && params[filterConst.key] !== 'false') {
        const value = params[filterConst.key];
        if (Array.isArray(value)) {
          filters[filterConst.key] = _.map(value, (val) => {
            return { value: val };
          });
        } else {
          filters[filterConst.key] = [{ value }];
        }
      } else {
        filters[filterConst.key] = [];
      }
    });
  }
  return filters;
};

export {
  getUserOpportunityFromOffer,
  getChildrenFilters,
  getAllFilters,
  findFilter,
  initializeFilters,
  filtersToQueryParams,
  getFiltersObjectsFromQueryParamsFront,
};
