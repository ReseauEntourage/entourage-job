import { useCallback } from 'react';
import Api from 'src/Axios';
import { filtersToQueryParams } from 'src/utils';

export function useOpportunityList(
  setOffers,
  setOtherOffers,
  setNumberOfResults,
  setLoading,
  setHasError
) {
  return useCallback(
    async (role, search, tabFilter, filters, candidatId) => {
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
              data.offers.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
              })
            );
            setOtherOffers(undefined);
            setNumberOfResults(data.offers.length);
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
              data.offers.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
              })
            );
            setOtherOffers(undefined);
            setNumberOfResults(data.offers.length);
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
            setOffers(data.offers);
            setOtherOffers(data.otherOffers);
            setNumberOfResults(data.offers.length);
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
