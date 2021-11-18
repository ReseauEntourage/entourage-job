/* global UIkit */
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { getUserOpportunityFromOffer } from 'src/utils';
import Api from 'src/Axios';
import ModalOffer from 'src/components/modals/ModalOffer';
import { Grid, SimpleLink } from 'src/components/utils';
import OfferCard from 'src/components/cards/OfferCard';
import { UserContext } from 'src/components/store/UserProvider';
import ModalOfferAdmin from 'src/components/modals/ModalOfferAdmin';
import OpportunityError from 'src/components/opportunities/OpportunityError';
import { useOpportunityList } from 'src/hooks/useOpportunityList';

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
      push,
      query: { offerId: opportunityId, ...restQuery },
    } = useRouter();

    const { user } = useContext(UserContext);

    const [currentOffer, setCurrentOffer] = useState(null);
    const [offers, setOffers] = useState(undefined);
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(true);

    const isAdmin = role === 'admin' || role === 'candidateAsAdmin';

    const currentPath = {
      as: `/backoffice/${
        role === 'candidateAsAdmin'
          ? `admin/membres/${candidatId}/offres`
          : `${role}/offres`
      }`,
      href: `/backoffice/${
        role === 'candidateAsAdmin'
          ? 'admin/membres/[memberId]/[tab]'
          : `${role}/offres`
      }`,
    };

    const fetchData = useOpportunityList(
      user,
      candidatId,
      role,
      search,
      tabFilter,
      filters,
      setOffers,
      setLoading,
      setHasError
    );

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
                      <SimpleLink
                        scroll={false}
                        className="uk-link-reset"
                        href={`${currentPath.href}/[offerId]`}
                        as={{
                          pathname: `${currentPath.as}/${offer.id}`,
                          query: restQuery,
                        }}
                        /* href={`${currentPath.href}/[offerId]`} */
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
                      </SimpleLink>
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
              selectedCandidateId={
                role === 'candidateAsAdmin' ? candidatId : undefined
              }
              navigateBackToList={() => {
                return push(currentPath.href, currentPath.as, {
                  scroll: false,
                });
              }}
            />
          ) : (
            <ModalOffer
              currentOffer={currentOffer}
              setCurrentOffer={(offer) => {
                setCurrentOffer({ ...offer });
                fetchData();
              }}
              navigateBackToList={() => {
                return push(currentPath.href, currentPath.as, {
                  scroll: false,
                });
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
  userRole: PropTypes.oneOf(['admin', 'candidateAsAdmin', 'candidat']),
};

OpportunityList.defaultProps = {
  candidatId: undefined,
  filters: undefined,
  tabFilter: undefined,
  userRole: 'candidat',
  search: undefined,
  updateNumberOfResults: () => {},
};

export default OpportunityList;
