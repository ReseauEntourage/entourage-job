/* global UIkit */
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../components/store/UserProvider';
import LayoutBackOffice from '../../components/backoffice/LayoutBackOffice';
import { Section } from '../../components/utils';
import OfferCard from '../../components/cards/OfferCard';
import HeaderBackoffice from '../../components/headers/HeaderBackoffice';
import ModalOffer from '../../components/modals/ModalOffer';
import Api from '../../Axios';

function getTag(offer) {
  if (offer.userOpportunity && offer.userOpportunity.archived) {
    return 'tag-archive';
  }
  return `tag-${offer.category.toLowerCase()}`;
}
const Opportunites = () => {
  const [currentOffer, setCurrentOffer] = useState(null);
  const [offers, setOffers] = useState(undefined);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data } = await Api.get(
            `${process.env.SERVER_URL}/api/v1/opportunity/user/all/${user.id}`
          );

          // sorted by bookmark and date
          const sortedOffers = data.sort((a, b) => {
            if (a.userOpportunity || b.userOpportunity) {
              if (a.userOpportunity && b.userOpportunity) {
                if (
                  b.userOpportunity.bookmarked &&
                  a.userOpportunity.bookmarked
                ) {
                  return new Date(b.date) - new Date(a.date);
                }
                return (
                  b.userOpportunity.bookmarked - a.userOpportunity.bookmarked
                );
              }
              if (b.userOpportunity) return b.userOpportunity.bookmarked;
            }
            return new Date(b.date) - new Date(a.date);
          });
          setOffers(sortedOffers);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
          setHasError(true);
        }
      } else console.log('no user');
    };
    fetchData();
  }, [user, currentOffer]);

  return (
    <LayoutBackOffice title="Mes opportunités">
      <Section>
        <HeaderBackoffice
          title="Consulte toutes tes opportunités de travail"
          description="Parcours les offres qui t&rsquo;ont été adressées directement ainsi que celles communes aux différents candidats du parcours LinkedOut."
        />
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
            <div uk-filter="target: #opportunitees">
              <ul className="uk-subnav ent-subnav">
                <li uk-filter-control=".tag-private" className="uk-active">
                  <a href="#">Mes offres</a>
                </li>
                <li uk-filter-control=".tag-public">
                  <a href="#">Offres générales</a>
                </li>
                <li uk-filter-control=".tag-archive">
                  <a href="#">Offres archivées</a>
                </li>
              </ul>
              {loading ? (
                <div className="uk-height-medium uk-flex uk-flex-center uk-flex-middle">
                  <div data-uk-spinner="" />
                </div>
              ) : (
                <ul
                  id="opportunitees"
                  className="uk-grid-match uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-3@l"
                  data-uk-grid=""
                  uk-height-match="target: > li .uk-card"
                >
                  {offers &&
                    offers.map((offer, i) => {
                      return (
                        <li key={i} className={getTag(offer)}>
                          <a
                            className="uk-link-reset"
                            onClick={async () => {
                              const opportunity = offer;
                              // si jamais ouvert
                              if (!offer.userOpportunity) {
                                const { data } = await Api.post(
                                  `${process.env.SERVER_URL}/api/v1/opportunity/join`,
                                  {
                                    opportunityId: offer.id,
                                    userId: user.id,
                                  }
                                );
                                opportunity.userOpportunity = data;
                              }

                              setCurrentOffer(opportunity);
                              UIkit.modal('#modal-offer').show();
                            }}
                            aria-hidden
                            role="button"
                          >
                            <OfferCard
                              title={offer.title}
                              from={offer.recruiterName}
                              shortDescription={offer.company}
                              archived={
                                offer.userOpportunity &&
                                offer.userOpportunity.archived
                              }
                              isNew={!offer.userOpportunity}
                              isStared={
                                offer.userOpportunity &&
                                offer.userOpportunity.bookmarked
                              }
                              status={
                                offer.userOpportunity &&
                                offer.userOpportunity.status
                              }
                            />
                          </a>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
            <ModalOffer
              currentOffer={currentOffer}
              setCurrentOffer={(offer) => {
                setCurrentOffer(offer);
              }}
            />
          </>
        )}
      </Section>
    </LayoutBackOffice>
  );
};
export default Opportunites;
