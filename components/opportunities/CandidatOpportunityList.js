/* global UIkit */
import React, { useContext, useEffect, useCallback, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Api from '../../Axios';
import ModalOffer from '../modals/ModalOffer';
import { GridNoSSR } from '../utils';
import OfferCard from '../cards/OfferCard';
import { UserContext } from '../store/UserProvider';
import ModalOfferAdmin from '../modals/ModalOfferAdmin';
import OpportunityError from './OpportunityError';
import { getUserOpportunityFromOffer } from '../../backend/utils/Filters';

const filterToQueryParams = (filters) => {
  const params = {};
  _.forEach(Object.keys(filters), (filter) => {
    params[filter] = filters[filter].map((f) => {
      return f.value;
    });
  });
  return params;
};

const CandidatOpportunityList = ({
  candidatId,
  filters,
  updateNumberOfResults,
  isAdmin,
}) => {
  const { user } = useContext(UserContext);

  const [currentOffer, setCurrentOffer] = useState(null);
  const [offers, setOffers] = useState(undefined);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (user) {
      try {
        if (isAdmin) {
          setLoading(true);
          const { data } = await Api.get(
            `${process.env.SERVER_URL}/api/v1/opportunity/user/private/${candidatId}`,
            {
              params: filterToQueryParams(filters),
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

        const { data } = await Api.get(
          `${process.env.SERVER_URL}/api/v1/opportunity/user/all/${candidatId}`,
          {
            params: filterToQueryParams(filters),
          }
        );
        setOffers(data);
        return data;
      } catch (err) {
        console.error(err);
        setLoading(false);
        setHasError(true);
      }
    }
    return null;
  }, [candidatId, filters, isAdmin, user]);

  const onClickOpportunityCardAsUser = async (offer) => {
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
      fetchData();
    }
    setCurrentOffer({ ...opportunity });
    UIkit.modal('#modal-offer').show();
  };

  useEffect(() => {
    setHasError(false);
    setLoading(true);
    fetchData();
  }, [filters, candidatId, fetchData]);

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
    <div>
      {loading && (
        <div className="uk-text-center">
          <div data-uk-spinner />
        </div>
      )}
      {!loading && hasError && <OpportunityError />}
      {!loading && !hasError && (
        <div>
          {offers && offers.length > 0 ? (
            <GridNoSSR childWidths={['1-4@l', '1-3@m', '1-2@s']} left top>
              {offers.map((offer, i) => {
                const userOpportunity = getUserOpportunityFromOffer(
                  offer,
                  candidatId
                );
                return (
                  <li key={i}>
                    <a
                      aria-hidden
                      role="button"
                      className="uk-link-reset"
                      onClick={() => {
                        if (isAdmin) {
                          setCurrentOffer({
                            ...offer,
                          });
                          UIkit.modal('#modal-offer-admin').show();
                        } else {
                          onClickOpportunityCardAsUser(offer);
                        }
                      }}
                    >
                      {' '}
                      {isAdmin ? (
                        <OfferCard
                          title={offer.title}
                          from={offer.recruiterName}
                          shortDescription={offer.company}
                          date={offer.date}
                          archived={offer.isArchived}
                          isPublic={offer.isPublic}
                          isValidated={offer.isValidated}
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
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </GridNoSSR>
          ) : (
            <div className=" uk-text-center uk-flex uk-flex-center">
              <div className="uk-width-xlarge">
                <p className="uk-text-italic">
                  {Object.values(filters).reduce((acc, curr) => {
                    return acc + curr.length;
                  }, 0) > 0
                    ? 'Aucun résultat.'
                    : "Aucune proposition n'a été faite au candidat."}
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
};

CandidatOpportunityList.propTypes = {
  candidatId: PropTypes.string.isRequired,
  filters: PropTypes.shape(),
  updateNumberOfResults: PropTypes.func,
  isAdmin: PropTypes.bool,
};

CandidatOpportunityList.defaultProps = {
  filters: undefined,
  isAdmin: false,
  updateNumberOfResults: () => {},
};

export default CandidatOpportunityList;
