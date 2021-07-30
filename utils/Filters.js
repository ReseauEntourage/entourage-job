const _ = require('lodash');
const {
  OPPORTUNITY_FILTERS_DATA,
  CV_FILTERS_DATA,
  OFFER_CANDIDATE_FILTERS_DATA,
  OFFER_ADMIN_FILTERS_DATA,
} = require('../constants');

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

const hasAsChild = (filters, parent, value, notFirst) => {
  let parentFilter = parent;

  if (!notFirst) {
    parentFilter = findFilter(filters, parent);
  }

  if (
    parentFilter &&
    parentFilter.children &&
    parentFilter.children.length > 0
  ) {
    const index = parentFilter.children.findIndex((filter) => {
      const found = value.toLowerCase().includes(filter.value.toLowerCase());
      if (!found && filter.children && filter.children.length > 0) {
        return hasAsChild(filter.children, filter, value, true);
      }
      return found;
    });
    return index >= 0;
  }
  return false;
};

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
          filters[paramKey] = valueArray.map((val) => {
            return { value: val };
          });
        }
      }
    });
  }
  return filters;
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
                hasFound = filtersObj[keys[i]].some((currentFilter) => {
                  return (
                    currentFilter.value === userOpportunity.status.toString()
                  );
                });
              } else {
                hasFound = filtersObj[keys[i]].some((currentFilter) => {
                  if (
                    offer.userOpportunity &&
                    offer.userOpportunity.length > 0
                  ) {
                    return offer.userOpportunity.some((userOpp) => {
                      return currentFilter.value === userOpp.status;
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

const filterCVs = (cvs, filtersObj) => {
  let filteredList = cvs;

  if (cvs && filtersObj) {
    const keys = Object.keys(filtersObj);

    if (keys.length > 0) {
      const totalFilters = keys.reduce((acc, curr) => {
        return acc + filtersObj[curr].length;
      }, 0);

      if (totalFilters > 0) {
        filteredList = cvs.filter((cv) => {
          const resultForEachFilter = [];
          for (let i = 0; i < keys.length; i += 1) {
            const currentFilterConstants = CV_FILTERS_DATA.find((data) => {
              return data.key === keys[i];
            }).constants;

            let hasFound = false;
            if (filtersObj[keys[i]].length === 0) {
              hasFound = true;
            } else if (keys[i] === CV_FILTERS_DATA[0].key) {
              hasFound = !cv.user.employed;
            } else if (cv[keys[i]].length > 0) {
              hasFound = filtersObj[keys[i]].some((currentFilter) => {
                return (
                  cv[keys[i]].findIndex((value) => {
                    const isInChildren = hasAsChild(
                      currentFilterConstants,
                      value,
                      currentFilter.value
                    );
                    return (
                      isInChildren ||
                      value
                        .toLowerCase()
                        .includes(currentFilter.value.toLowerCase())
                    );
                  }) >= 0
                );
              });
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

  if (filteredList.length <= 0) {
    if (
      filtersObj &&
      filtersObj[CV_FILTERS_DATA[2].key] &&
      filtersObj[CV_FILTERS_DATA[2].key].length > 0
    ) {
      if (
        filtersObj[CV_FILTERS_DATA[1].key] &&
        filtersObj[CV_FILTERS_DATA[1].key].length > 0
      ) {
        const filteredOtherCvs = filterCVs(cvs, {
          ...filtersObj,
          [CV_FILTERS_DATA[1].key]: [],
        });

        if (
          filteredOtherCvs &&
          filteredOtherCvs.cvs &&
          filteredOtherCvs.cvs.length > 0
        ) {
          return {
            cvs: filteredOtherCvs.cvs,
            suggestions: true,
          };
        }
      }
    }
  }
  return { cvs: filteredList };
};

const filtersToQueryParams = (filters) => {
  const params = {};
  _.forEach(Object.keys(filters), (filter) => {
    params[filter] = filters[filter].map((f) => {
      return f.value;
    });
  });
  return params;
};

module.exports = {
  filterOffers,
  filterCVs,
  getUserOpportunityFromOffer,
  getFiltersObjectsFromQueryParams,
  getChildrenFilters,
  getAllFilters,
  findFilter,
  hasAsChild,
  initializeFilters,
  filtersToQueryParams,
  filterCandidateOffersByType,
  filterAdminOffersByType,
};
