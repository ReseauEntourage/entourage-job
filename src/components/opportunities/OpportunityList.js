/* global UIkit */
import React, {
  useContext,
  useEffect,
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { filtersToQueryParams, getUserOpportunityFromOffer } from 'src/utils';
import Api from 'src/Axios';
import ModalOffer from 'src/components/modals/ModalOffer';
import { Grid } from 'src/components/utils';
import OfferCard from 'src/components/cards/OfferCard';
import { UserContext } from 'src/components/store/UserProvider';
import ModalOfferAdmin from 'src/components/modals/ModalOfferAdmin';
import OpportunityError from 'src/components/opportunities/OpportunityError';

const OpportunityList = forwardRef(
  (
    {
      candidatId,
      search,
      filters,
      tabFilter,
      updateNumberOfResults,
      userRole: role,
    },
    ref
  ) => {
    const {
      query: { q: opportunityId },
    } = useRouter();

    const { user } = useContext(UserContext);

    const [currentOffer, setCurrentOffer] = useState(null);
    const [offers, setOffers] = useState(undefined);
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(true);

    const isAdmin = role === 'admin' || role === 'candidateAsAdmin';

    const fetchData = useCallback(async () => {
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
    }, [candidatId, filters, role, search, tabFilter, user]);

    useImperativeHandle(ref, () => {
      return {
        fetchData,
      };
    });

    const onClickOpportunityCardAsUser = useCallback(
      async (offer) => {
        const opportunity = offer;
        // si jamais ouvert
        if (!opportunity.userOpportunity || !opportunity.userOpportunity.seen) {
          const { data } = await Api.post(
            `${process.env.SERVER_URL}/api/v1/opportunity/join`,
            {
              opportunityId: offer.id,
              userId: candidatId,
              seen: true,
            }
          );
          opportunity.userOpportunity = data;
        }
        setCurrentOffer({ ...opportunity });
        UIkit.modal('#modal-offer').show();
      },
      [candidatId]
    );

    const openOffer = useCallback(
      (offer) => {
        if (isAdmin) {
          setCurrentOffer({
            ...offer,
          });
          UIkit.modal('#modal-offer-admin').show();
        } else {
          onClickOpportunityCardAsUser(offer);
        }
      },
      [isAdmin, onClickOpportunityCardAsUser]
    );

    const getOpportunity = useCallback(async () => {
      try {
        const { data: offer } = await Api.get(
          `${process.env.SERVER_URL}/api/v1/opportunity/${opportunityId}`
        );
        return offer;
      } catch (err) {
        console.error(err);
        return null;
      }
    }, [opportunityId]);

    useEffect(() => {
      if (opportunityId) {
        getOpportunity().then((offer) => {
          if (offer) {
            openOffer(offer);
          }
        });
      }
    }, [getOpportunity, openOffer, opportunityId]);

    useEffect(() => {
      setHasError(false);
      setLoading(true);
      fetchData();
    }, [fetchData]);

    useEffect(() => {
      const hasFiltersActivated = Object.keys(filters).some((filter) => {
        return filters[filter].length > 0;
      });
      if (hasFiltersActivated && offers) {
        updateNumberOfResults(offers.length);
        setLoading(false);
      }
    }, [filters, offers, updateNumberOfResults]);

    if (!user) return null;

    return (
      <div className="uk-margin-medium-top">
        {loading && (
          <div className="uk-text-center">
            <div data-uk-spinner />
          </div>
        )}
        {!loading && hasError && <OpportunityError />}
        {!loading && !hasError && (
          <div>
            {offers && offers.length > 0 ? (
              <Grid childWidths={['1-4@l', '1-3@m', '1-2@s']} left top>
                {offers.map((offer, i) => {
                  const userOpportunity =
                    role === 'candidateAsAdmin'
                      ? getUserOpportunityFromOffer(offer, candidatId)
                      : offer.userOpportunity;
                  return (
                    <li key={i}>
                      <a
                        aria-hidden
                        role="button"
                        className="uk-link-reset"
                        onClick={() => {
                          return openOffer(offer);
                        }}
                      >
                        {isAdmin ? (
                          <OfferCard
                            title={offer.title}
                            from={offer.recruiterName}
                            shortDescription={offer.company}
                            date={offer.date}
                            archived={offer.isArchived}
                            isPublic={offer.isPublic}
                            isValidated={offer.isValidated}
                            department={offer.department}
                            userOpportunity={userOpportunity}
                            isAdmin
                          />
                        ) : (
                          <OfferCard
                            title={offer.title}
                            from={offer.recruiterName}
                            shortDescription={offer.company}
                            date={offer.date}
                            isValidated={offer.isValidated}
                            isPublic={offer.isPublic}
                            userOpportunity={offer.userOpportunity}
                            archived={
                              offer.userOpportunity &&
                              offer.userOpportunity.archived
                            }
                            isNew={
                              !offer.userOpportunity ||
                              !offer.userOpportunity.seen
                            }
                            isStared={
                              offer.userOpportunity &&
                              offer.userOpportunity.bookmarked
                            }
                            department={offer.department}
                          />
                        )}
                      </a>
                    </li>
                  );
                })}
              </Grid>
            ) : (
              <div className=" uk-text-center uk-flex uk-flex-center uk-margin-medium-top">
                <div className="uk-width-xlarge">
                  <p className="uk-text-italic">
                    {Object.values(filters).reduce((acc, curr) => {
                      return acc + curr.length;
                    }, 0) > 0 || search
                      ? 'Aucun résultat.'
                      : `${
                          role === 'admin'
                            ? "Aucune offre d'emploi."
                            : "Aucune proposition n'a été faite au candidat."
                        }`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        <div>
          {isAdmin ? (
            <ModalOfferAdmin
              currentOffer={currentOffer}
              setCurrentOffer={(offer) => {
                setCurrentOffer({ ...offer });
                fetchData();
              }}
            />
          ) : (
            <ModalOffer
              currentOffer={currentOffer}
              setCurrentOffer={(offer) => {
                setCurrentOffer({ ...offer });
                fetchData();
              }}
            />
          )}
        </div>
      </div>
    );
  }
);

OpportunityList.propTypes = {
  candidatId: PropTypes.string,
  filters: PropTypes.shape(),
  search: PropTypes.string,
  tabFilter: PropTypes.string,
  updateNumberOfResults: PropTypes.func,
  userRole: PropTypes.oneOf(['admin', 'candidateAsAdmin', 'candidate']),
};

OpportunityList.defaultProps = {
  candidatId: undefined,
  filters: undefined,
  tabFilter: undefined,
  userRole: 'candidate',
  search: undefined,
  updateNumberOfResults: () => {},
};

export default OpportunityList;
