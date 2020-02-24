/* global UIkit */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LayoutBackOffice from '../../../components/backoffice/LayoutBackOffice';
import { Section } from '../../../components/utils';
import OfferCard from '../../../components/cards/OfferCard';
import HeaderBackoffice from '../../../components/headers/HeaderBackoffice';
import ModalOfferAdmin from '../../../components/modals/ModalOfferAdmin';
import Filter from '../../../components/utils/Filter';
import Axios from '../../../Axios';

const LesOpportunites = () => {
  const [currentOffer, setCurrentOffer] = useState(null);
  const [offers, setOffers] = useState(undefined);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    query: { q: opportunityId },
  } = useRouter();

  const filters = [
    { tag: 'all', title: 'Toutes les offres' },
    { tag: 'pending', title: 'Offres à valider', active: true },
    { tag: 'validated', title: 'Offres publiées' },
    { tag: 'archived', title: 'Offres archivées' },
  ];

  const getTag = (offer) => {
    const tag = ['all'];
    if (offer.isArchived) {
      tag.push('archived');
    } else if (offer.isValidated) {
      tag.push('validated');
    } else {
      tag.push('pending');
    }
    return tag.map((t) => `tag-${t}`).join(' ');
  };

  const fetchData = async (query) => {
    setLoading(true);
    try {
      const { data } = await Axios.get(
        `${process.env.SERVER_URL}/api/v1/opportunity/admin`,
        {
          params: {
            query,
          },
        }
      );
      console.log(data);
      setOffers(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setLoading(false);
      return data;
    } catch (err) {
      console.error(err);
      setLoading(false);
      setHasError(true);
    }
  };

  useEffect(() => {
    fetchData().then((data) => {
      const offer = data.find((o) => o.id === opportunityId);
      if (offer) {
        console.log(offer);
        setCurrentOffer(offer);
        UIkit.modal('#modal-offer-admin').show();
      }
    });
  }, [opportunityId]);

  return (
    <LayoutBackOffice title="Modération des offres d'emploi">
      <Section>
        <HeaderBackoffice
          title="Modération des offres d'emploi"
          description="Ici tu peux accéder à toutes les opportunités et valider les offres qui se retrouveront ensuite dans les tableaux des candidats."
        >
          <button
            type="button"
            className="uk-button uk-button-primary"
            style={{
              color: 'white',
              backgroundColor: '#F55F24',
              backgroundImage: 'none',
              textTransform: 'none',
              boder: null,
              padding: '0px 20px',
              borderRadius: '2px',
            }}
            onClick={() => {
              console.log('#add-opportunity');
              // UIkit.modal('#add-opportunity').show();
            }}
          >
            <span
              uk-icon="icon: plus; ratio:0.8"
              className="uk-margin-small-right"
            />
            Nouvelle opportunité
          </button>
        </HeaderBackoffice>
        {hasError ? (
          <Section className="uk-width-1-1">
            <div className=" uk-text-center uk-flex uk-flex-center">
              <div className="uk-width-xlarge">
                <h2 className="uk-margin-remove">
                  Les opportunités n&apos;ont pas pu etre chargés correctement.
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
        ) : (
          <>
            <Filter
              id="opportunitees"
              loading={loading}
              filters={filters}
              search={({ target: { value } }) => {
                fetchData(value);
              }}
            >
              {offers &&
                offers.map((offer, i) => {
                  return (
                    <li key={i} className={getTag(offer)}>
                      <a
                        aria-hidden
                        role="button"
                        className="uk-link-reset"
                        onClick={() => {
                          setCurrentOffer(offer);
                          UIkit.modal('#modal-offer-admin').show();
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
                  );
                })}
            </Filter>
            <ModalOfferAdmin
              currentOffer={currentOffer}
              setCurrentOffer={(offer) => {
                setCurrentOffer(offer);
                fetchData();
              }}
            />
          </>
        )}
      </Section>
    </LayoutBackOffice>
  );
};
export default LesOpportunites;
