export const getChildrenFilters = (filters) => {
  return filters.reduce((acc, curr) => {
    const accToReturn = [...acc];
    if(curr.children && curr.children.length > 0) {
      return [...accToReturn, ...getChildrenFilters(curr.children)];
    }
    return [...accToReturn, {
      value: curr.value,
      label: curr.label,
    }];
  }, []);
};

export const getAllFilters = (filters) => {
  return filters.reduce((acc, curr) => {
    const accToReturn = [...acc, {
      value: curr.value,
      label: curr.label,
    }];
    if(curr.children && curr.children.length > 0) {
      return [...accToReturn, ...getAllFilters(curr.children)];
    }
    return accToReturn;
  }, []);
};


export const findFilter = (filters, value) => {
  return filters.reduce((acc, curr) => {
    if(!acc || acc.value !== value) {
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

