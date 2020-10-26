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

const getAllFilters = (filters) => {
  return filters.reduce((acc, curr) => {
    const accToReturn = [
      ...acc,
      {
        value: curr.value,
        label: curr.label,
      },
    ];
    if (curr.children && curr.children.length > 0) {
      return [...accToReturn, ...getAllFilters(curr.children)];
    }
    return accToReturn;
  }, []);
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

const initializeFilters = (filtersConst) => {
  return filtersConst.reduce((acc, curr) => {
    acc[curr.key] = [];
    return acc;
  }, {});
};

module.exports = {
  getChildrenFilters,
  getAllFilters,
  findFilter,
  hasAsChild,
  initializeFilters,
};
