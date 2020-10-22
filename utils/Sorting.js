const React = require('react');

const sortExperiences = (list) => {
  const listToSort = [...list];
  listToSort.sort((a, b) => (a.order < b.order ? -1 : 1));
  return listToSort;
};

const sortReviews = (list) => {
  const listToSort = [...list];
  listToSort.sort((a, b) => (a.name.localeCompare(b.name) < 0 ? -1 : 1));
  return listToSort;
};

module.export = {
  sortExperiences,
  sortReviews,
};
