/* global UIkit */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, Section } from '../utils';
import OfferCard from "../cards/OfferCard";
import Axios from '../../Axios';
import { UserContext } from '../store/UserProvider';
import ModalOfferAdmin from "../modals/ModalOfferAdmin";
import { ModalContext } from '../store/ModalProvider';

const OpportunitiesList = ({ candidatId }) => {
  const { user } = useContext(UserContext);
  const { triggerModal } = useContext(ModalContext);

  const [currentOffer, setCurrentOffer] = useState(null);
  const [offers, setOffers] = useState(undefined);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async (id) => {
    if (user) {
      try {
        setLoading(true);
        const { data } = await Axios.get(
          `${process.env.SERVER_URL}/api/v1/opportunity/user/private/${id}`
        );
        setOffers(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        setLoading(false);
        return data;
      } catch (err) {
        console.error(err);
        setLoading(false);
        setHasError(true);
      }
    }
    return null;
  };

  useEffect(() => {
    fetchData(candidatId);
  }, [candidatId]);

  if (!user) return null;

  return (
    <div>
      {
        loading ?
          <div className="uk-height-medium uk-flex uk-flex-center uk-flex-middle">
            <div data-uk-spinner="" />
          </div>
          :
          (
            hasError ?
              <Section className="uk-width-1-1">
                <div className=" uk-text-center uk-flex uk-flex-center">
                  <div className="uk-width-xlarge">
                    <h2 className="uk-margin-remove">
                      Les opportunités du candidat n&apos;ont pas pu etre chargés correctement.
                    </h2>
                    <p>
                      Contacte{' '}
                      <span className="uk-text-primary">
                        l&apos;équipe LinkedOut
                    </span>{' '}
                      pour en savoir plus.
                    </p>
                  </div>
                </div>
              </Section>
              :
              (
                offers && offers.length > 0 ?
                  <GridNoSSR
                    childWidths={['1-4@l', '1-3@m', '1-2@s']}
                    left
                    top
                  >
                    {
                      offers.map((offer, i) => {
                        return (
                          <li key={i}>
                            <a
                              aria-hidden
                              role="button"
                              className="uk-link-reset"
                              onClick={() => {
                                setCurrentOffer(offer);
                                triggerModal('#modal-offer-admin');
                              }}
                            >
                              <OfferCard
                                title={offer.title}
                                from={offer.recruiterName}
                                shortDescription={offer.company}
                                date={offer.date}
                                archived={offer.isArchived}
                                isPublic={offer.isPublic}
                                specifiedOffer={
                                  !offer.isPublic &&
                                  offer.userOpportunity &&
                                  offer.userOpportunity[0] &&
                                  offer.userOpportunity[0].User &&
                                  offer.userOpportunity[0].User.firstName
                                }
                                customBadge={(() => {
                                  let className = ' uk-label-warning';
                                  let content = 'En attente';
                                  if (offer.isValidated) {
                                    content = 'Validé';
                                    className = ' uk-label-success';
                                  }
                                  if (offer.isArchived) {
                                    content = 'Archivé';
                                    className = ' uk-label-danger';
                                  }
                                  return (
                                    <div
                                      className={`uk-card-badge uk-label${className}`}
                                    >
                                      {content}
                                    </div>
                                  );
                                })()}
                              />
                            </a>
                          </li>
                        )
                      })
                    }
                  </GridNoSSR>
                  :
                  <div className=" uk-text-center uk-flex uk-flex-center">
                    <div className="uk-width-xlarge">
                      <p className="uk-text-italic">
                        Aucune proposition n&apos;a été faite au candidat.
                      </p>
                    </div>
                  </div>
              )
          )
      }
      <div>
        <ModalOfferAdmin
          currentOffer={currentOffer}
          setCurrentOffer={(offer) => {
            setCurrentOffer(offer);
            fetchData(candidatId);
          }} />
      </div>
    </div>
  );
};

OpportunitiesList.propTypes = {
  candidatId: PropTypes.string.isRequired
};

OpportunitiesList.defaultProps = {};

export default OpportunitiesList;
