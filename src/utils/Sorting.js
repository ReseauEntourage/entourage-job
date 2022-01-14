import { firstBy } from 'thenby';
import { getUserOpportunityFromOffer } from 'src/utils/Filters';

const sortByUserOpportunity = (a, b, candidatId, key) => {
  const userOpportunityA = getUserOpportunityFromOffer(a, candidatId);
  const userOpportunityB = getUserOpportunityFromOffer(b, candidatId);
  if (userOpportunityA || userOpportunityB) {
    if (userOpportunityA && userOpportunityB) {
      return userOpportunityB[key] - userOpportunityA[key];
    }
  }
  return 0;
};

const sortOpportunities = (opportunities, isPrivate, candidateId) => {
  // Public offers : order by recommended new, then new, then bookmarked, then recommended, then by status, then by date
  // Private offers : order by private new, then public recommended new, then private bookmarked, then public recommended, then by status, then by date
  const sortedOpportunities = [...opportunities];
  sortedOpportunities.sort(
    firstBy('isArchived')
      .thenBy((a, b) => {
        return sortByUserOpportunity(a, b, candidateId, 'archived');
      }, 'desc')
      .thenBy((a, b) => {
        const userOpportunityA = getUserOpportunityFromOffer(a, candidateId);
        const userOpportunityB = getUserOpportunityFromOffer(b, candidateId);
        if (userOpportunityA || userOpportunityB) {
          if (userOpportunityA && userOpportunityB) {
            return sortByUserOpportunity(a, b, candidateId, 'seen');
          }
          if (!userOpportunityB) {
            return (isPrivate ? !a.isPublic : a.isPublic) &&
              userOpportunityA.recommended &&
              !userOpportunityA.seen
              ? 1
              : -1;
          }

          if (!userOpportunityA) {
            return (isPrivate ? !b.isPublic : b.isPublic) &&
              userOpportunityB.recommended &&
              !userOpportunityB.seen
              ? -1
              : 1;
          }
        }
        return sortByUserOpportunity(a, b, candidateId, 'seen');
      }, 'desc')
      .thenBy('isPublic')
      .thenBy((a, b) => {
        return sortByUserOpportunity(a, b, candidateId, 'bookmarked');
      })
      .thenBy((a, b) => {
        return sortByUserOpportunity(a, b, candidateId, 'recommended');
      })
      .thenBy((a, b) => {
        return sortByUserOpportunity(a, b, candidateId, 'status');
      })
      .thenBy((a, b) => {
        return new Date(b.date) - new Date(a.date);
      })
  );

  return sortedOpportunities;
};

export { sortOpportunities };
