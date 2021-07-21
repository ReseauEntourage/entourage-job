/* global UIkit */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Api from '../../Axios';
import ModalOffer from '../modals/ModalOffer';
import { GridNoSSR } from '../utils';
import OfferCard from '../cards/OfferCard';
import { UserContext } from '../store/UserProvider';
import ModalOfferAdmin from '../modals/ModalOfferAdmin';
import { OPPORTUNITY_FILTERS_DATA } from '../../constants';
import OpportunityError from './OpportunityError';
import { getUserOpportunityFromOffer } from '../../utils';

const CandidatOpportunityList = ({
  candidatId,
  filters,
  updateNumberOfResults,
  isAdmin,
}) => {
  const { user } = useContext(UserContext);

  const [currentOffer, setCurrentOffer] = useState(null);
  const [offers, setOffers] = useState(undefined);
  const [filteredOffers, setFilteredOffers] = useState(undefined);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async (id) => {
    console.log('FETCH DATA');
    if (user) {
      try {
        if (isAdmin) {
          setLoading(true);
          const { data } = await Api.get(
            `${process.env.SERVER_URL}/api/v1/opportunity/user/private/${id}`
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
          `${process.env.SERVER_URL}/api/v1/opportunity/user/all/${id}`
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
  };

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
      fetchData(candidatId);
    }
    setCurrentOffer({ ...opportunity });
    UIkit.modal('#modal-offer').show();
  };

  useEffect(() => {
    fetchData(candidatId);
  }, [candidatId]);

  const filterOffers = (filtersObj) => {
    let filteredList = offers;

    if (offers && filtersObj) {
      const keys = Object.keys(filtersObj);

      if (keys.length > 0) {
        const totalFilters = keys.reduce((acc, curr) => {
          return acc + filtersObj[curr].length;
        }, 0);

        if (totalFilters > 0) {
          filteredList = offers.filter((offer) => {
            // TODO make generic if several filters
            const resultForEachFilter = [];
            for (let i = 0; i < keys.length; i += 1) {
              let hasFound = false;
              if (filtersObj[keys[i]].length === 0) {
                hasFound = true;
              } else if (keys[i] === OPPORTUNITY_FILTERS_DATA[0].key) {
                const userOpportunity = getUserOpportunityFromOffer(
                  offer,
                  candidatId
                );
                hasFound = filtersObj[keys[i]].some((currentFilter) => {
                  return currentFilter.value === userOpportunity.status;
                });
              } else if (keys[i] === OPPORTUNITY_FILTERS_DATA[1].key) {
                hasFound = offer.isPublic;
              }
              resultForEachFilter.push(hasFound);
            }

            return resultForEachFilter.every((value) => {
              return value;
            });
          });
        }
      }
    }

    return filteredList;
  };

  useEffect(() => {
    setHasError(false);
    setLoading(true);
    setFilteredOffers(filterOffers(filters));
  }, [filters, offers]);

  useEffect(() => {
    if (filteredOffers) {
      updateNumberOfResults(filteredOffers.length);
      setLoading(false);
    }
  }, [filteredOffers]);

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
          {filteredOffers && filteredOffers.length > 0 ? (
            <GridNoSSR childWidths={['1-4@l', '1-3@m', '1-2@s']} left top>
              {filteredOffers.map((offer, i) => {
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
              fetchData(candidatId);
            }}
          />
        ) : (
          <ModalOffer
            currentOffer={currentOffer}
            setCurrentOffer={(offer) => {
              setCurrentOffer({ ...offer });
              fetchData(candidatId);
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
