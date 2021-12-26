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
            const {
              data: { offers },
            } = await Api.get(
              `${process.env.SERVER_URL}/api/v1/opportunity/user/private/${candidatId}`,
              {
                params: {
                  search,
                  ...filtersToQueryParams(filters),
                },
              }
            );
            const sortedOffers = offers.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            });

            setOffers(sortedOffers);
            setOtherOffers(undefined);
            setNumberOfResults(sortedOffers.length);

            break;
          }
          case 'admin': {
            const {
              data: { offers },
            } = await Api.get(
              `${process.env.SERVER_URL}/api/v1/opportunity/admin`,
              {
                params: {
                  search,
                  type: tabFilter,
                  ...filtersToQueryParams(filters),
                },
              }
            );
            /* console.log(
              offers.map((offer) => {
                return offer.isValidated;
              })
            ); */

            const sortedOffers = offers.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            });

            setOffers(sortedOffers);
            setOtherOffers(undefined);
            setNumberOfResults(sortedOffers.length);

            break;
          }
          default: {
            const {
              data: { offers, otherOffers },
            } = await Api.get(
              `${process.env.SERVER_URL}/api/v1/opportunity/user/all/${candidatId}`,
              {
                params: {
                  search,
                  type: tabFilter,
                  ...filtersToQueryParams(filters),
                },
              }
            );

            setOffers(offers);
            setOtherOffers(otherOffers);
            setNumberOfResults(offers.length);

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
    [setHasError, setLoading, setNumberOfResults, setOffers, setOtherOffers]
  );
}
