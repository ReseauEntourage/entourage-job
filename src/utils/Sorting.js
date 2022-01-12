import { firstBy } from 'thenby';

const sortByUserOpportunity = (a, b, key) => {
  if (a.userOpportunity || b.userOpportunity) {
    if (a.userOpportunity && b.userOpportunity) {
      return b.userOpportunity[key] - a.userOpportunity[key];
    }
    if (b.userOpportunity) {
      return 1;
    }
    if (a.userOpportunity) {
      return -1;
    }
  }
  return 0;
};

const sortOpportunities = (opportunities) => {
  // TODO FIX SORT

  // order by new, then bookmarked, then recommended, then by status, then by date
  const sortedOpportunities = [...opportunities];
  sortedOpportunities.sort(
    firstBy('isPublic')
      .thenBy((a, b) => {
        return sortByUserOpportunity(a, b, 'seen');
      }, 'desc')
      .thenBy((a, b) => {
        return sortByUserOpportunity(a, b, 'bookmarked');
      })
      .thenBy((a, b) => {
        return sortByUserOpportunity(a, b, 'recommended');
      })
      .thenBy((a, b) => {
        return sortByUserOpportunity(a, b, 'status');
      })
      .thenBy((a, b) => {
        return new Date(b.date) - new Date(a.date);
      })
  );

  /*
  sortedOpportunities.sort((a, b) => {
    if (a.userOpportunity || b.userOpportunity) {
      if (a.userOpportunity && b.userOpportunity) {
        if (a.userOpportunity.bookmarked === b.userOpportunity.bookmarked) {
          if (a.userOpportunity.seen === b.userOpportunity.seen) {
            if (a.userOpportunity.status === b.userOpportunity.status) {
              return new Date(b.date) - new Date(a.date);
            }
            if (
              a.userOpportunity.status >= OFFER_STATUS[4].value &&
              b.userOpportunity.status >= OFFER_STATUS[4].value
            ) {
              return b.userOpportunity.status - a.userOpportunity.status;
            }
            if (
              a.userOpportunity.status >= OFFER_STATUS[4].value &&
              b.userOpportunity.status < OFFER_STATUS[4].value
            ) {
              return 1;
            }
            if (
              a.userOpportunity.status < OFFER_STATUS[4].value &&
              b.userOpportunity.status >= OFFER_STATUS[4].value
            ) {
              return -1;
            }

            return b.userOpportunity.status - a.userOpportunity.status;
          }
          if (a.userOpportunity.seen && !b.userOpportunity.seen) {
            return -1;
          }
          if (!a.userOpportunity.seen && b.userOpportunity.seen) {
            return 1;
          }
        }
        if (a.userOpportunity.bookmarked && !b.userOpportunity.bookmarked) {
          return -1;
        }
        if (!a.userOpportunity.bookmarked && b.userOpportunity.bookmarked) {
          return 1;
        }
      }

      if (b.userOpportunity) {
        return -1;
      }
      if (a.userOpportunity) {
        return 1;
      }
    }

    return new Date(b.date) - new Date(a.date);
  });*/

  return sortedOpportunities;
};

export { sortOpportunities };
