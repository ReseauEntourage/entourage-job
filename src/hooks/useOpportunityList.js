import { useCallback } from 'react';
import Api from 'src/Axios';
import { filtersToQueryParams } from 'src/utils';

export function useOpportunityList(
  user,
  candidatId,
  role,
  search,
  tabFilter,
  filters,
  setOffers,
  setLoading,
  setHasError
) {
  return useCallback(async () => {
    if (user) {
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
            setLoading(false);
            return data;
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
            setLoading(false);
            return data;
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
            setLoading(false);
            return data;
          }
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
        setHasError(true);
      }
    }
    return null;
  }, [
    candidatId,
    filters,
    role,
    search,
    setHasError,
    setLoading,
    setOffers,
    tabFilter,
    user,
  ]);
}
