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
    const { children, ...restProps } = curr;
    const accToReturn = [...acc];
    if (children && children.length > 0) {
      return [...accToReturn, ...getChildrenFilters(curr.children)];
    }
    return [...accToReturn, restProps];
  }, []);
};

const getAllFilters = (filters, zone) => {
  const filtersToShow = filters.reduce((acc, curr) => {
    const { children, ...restProps } = curr;
    const accToReturn = [...acc, restProps];
    if (children && children.length > 0) {
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
            return f?.value;
          })
        : undefined;
  });
  return params;
};

const getFiltersObjectsFromQueryParamsFront = (params, filtersConst) => {
  const filters = {};
  if (filtersConst) {
    _.forEach(filtersConst, (filterConst) => {
      if (params[filterConst.key]) {
        const value = params[filterConst.key];
        if (Array.isArray(value)) {
          filters[filterConst.key] = [
            ..._.map(value, (val) => {
              return filterConst.constants.find((constantValue) => {
                return constantValue.value.toString() === val;
              });
            }),
          ];
        } else {
          filters[filterConst.key] = [
            filterConst.constants.find((constantValue) => {
              return constantValue.value.toString() === value;
            }),
          ];
        }
      } else {
        filters[filterConst.key] = [];
      }
    });
  }
  return filters;
};

const getFiltersTagsFromQueryParamsFront = (tag, filters) => {
  const updatedFilters = JSON.parse(JSON.stringify(filters));
  const filterToDeActivate = updatedFilters.find((filter) => {
    return filter.active;
  });
  const filterToActivate = updatedFilters.find((filter) => {
    return filter.tag === tag;
  });
  if (filterToDeActivate) filterToDeActivate.active = false;
  if (filterToActivate) filterToActivate.active = true;
  return updatedFilters;
};

export {
  getUserOpportunityFromOffer,
  getChildrenFilters,
  getAllFilters,
  findFilter,
  initializeFilters,
  filtersToQueryParams,
  getFiltersObjectsFromQueryParamsFront,
  getFiltersTagsFromQueryParamsFront,
};
