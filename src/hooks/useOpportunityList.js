import { useCallback } from 'react';
import Api from 'src/Axios';
import { filtersToQueryParams } from 'src/utils';

export function useOpportunityList(
  setOffers,
  setNumberOfResults,
  setLoading,
  setHasError
) {
  return useCallback(
    async (candidatId, role, search, tabFilter, filters) => {
      try {
        setLoading(true);

        switch (role) {
          case 'candidateAsAdmin': {
            const { data } = await Api.get(
              `${process.env.SERVER_URL}/api/v1/opportunity/user/private/${candidatId}`,
              {
                params: {
                  search,
                  ...filtersToQueryParams(filters),
                },
              }
            );
            setOffers(
              data.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
              })
            );
            setNumberOfResults(data.length);
            break;
          }
          case 'admin': {
            const { data } = await Api.get(
              `${process.env.SERVER_URL}/api/v1/opportunity/admin`,
              {
                params: {
                  search,
                  type: tabFilter,
                  ...filtersToQueryParams(filters),
                },
              }
            );
            setOffers(
              data.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
              })
            );
            setNumberOfResults(data.length);
            break;
          }
          default: {
            const { data } = await Api.get(
              `${process.env.SERVER_URL}/api/v1/opportunity/user/all/${candidatId}`,
              {
                params: {
                  search,
                  type: tabFilter,
                  ...filtersToQueryParams(filters),
                },
              }
            );
            setOffers(data);
            setNumberOfResults(data.length);
            break;
          }
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setHasError(true);
      }
    },
    [setHasError, setLoading, setNumberOfResults, setOffers]
  );
}
