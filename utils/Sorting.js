import React from 'react';

export function sortExperiences(list) {
  const listToSort = [...list];
  listToSort.sort((a, b) => a.order < b.order ? -1 : 1);
  return listToSort;
}

export function sortReviews(list) {
  const listToSort = [...list];
  listToSort.sort((a, b) => a.name.localeCompare(b.name) < 0 ? -1 : 1);
  return listToSort;
}
