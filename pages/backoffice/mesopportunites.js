/* global UIkit */
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../components/store/UserProvider';
import LayoutBackOffice from '../../components/backoffice/LayoutBackOffice';
import { Section } from '../../components/utils';
import OfferCard from '../../components/cards/OfferCard';
import HeaderBackoffice from '../../components/headers/HeaderBackoffice';
import ModalOffer from '../../components/modals/ModalOffer';
import Api from '../../Axios';

/*
const offersBase = (function generateOffers() {
  function randomPhrase(length) {
    const radom13chars = () =>
      Math.random()
        .toString(16)
        .substring(2, 15);

    const loops = Math.ceil(length / 13);
    const str = new Array(loops)
      .fill(radom13chars)
      .reduce((string, func) => {
        return string + func();
      }, '')
      .substring(0, length);

    return [...str].reduce(
      (acc, c) => acc + c + (Math.random() >= 0.6 ? ' ' : ''),
      ''
    );
  }
  if (typeof UIkit !== 'undefined') {
    return ['private', 'public', 'archive']
      .map((tag, i) =>
        Array(
          (() => {
            if (i === 0) return 4;
            if (i === 1) return 10;
            return 15;
          })()
        )
          .fill(0)
          .map(() => {
            const bookmarked = Math.random() >= 0.5;
            return {
              tag, // todo update the management
              // category
              bookmarked,
              isNew: bookmarked ? false : Math.random() >= 0.5,
              status: 'contacté',
              title: randomPhrase(8),
              company: randomPhrase(20),
              businessLine: randomPhrase(5),
              description: randomPhrase(250),
              date: randomPhrase(4),
              recruiterName: randomPhrase(6),
              recruiterEmail: randomPhrase(18),
              recruiterPhone: randomPhrase(10),
              location: randomPhrase(12),
            };
          })
      )
      .sort((a, b) => b.bookmarked - a.bookmarked || b.isNew - a.isNew)
      .flat();
  }
  return [];
})();
*/
function getTag(offer) {
  if (offer.userOpportunity && offer.userOpportunity.archived) {
    return 'tag-archive';
  }
  return `tag-${offer.category.toLowerCase()}`;
}
const Opportunites = () => {
  const [currentOffer, setCurrentOffer] = useState(null);
  const [offers, setOffers] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        const { data } = await Api.get(
          `${process.env.SERVER_URL}/api/v1/opportunity/user/all/${user.id}`
        );

        console.log(data);

        setOffers(
          data.sort((a, b) => {
            if (a.userOpportunity || b.userOpportunity) {
              if (a.userOpportunity && b.userOpportunity) {
                return (
                  b.userOpportunity.bookmarked - a.userOpportunity.bookmarked
                );
              }
              if (b.userOpportunity) return b.userOpportunity.bookmarked;
              return false;
            }
            return new Date(b.date) - new Date(a.date);
          })
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <LayoutBackOffice title="Mes opportunités">
      <Section>
        <HeaderBackoffice
          title="Consulte toutes tes opportunités de travail"
          description="Parcours les offres qui t&rsquo;ont été adressées directement ainsi que celles communes aux différents candidats du parcours LinkedOut."
        />
        {/* revoir le filtrage, utiliser des data */}{' '}
        {loading ? (
          <p className="uk-text-center">loading...</p>
        ) : (
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
            <ul
              id="opportunitees"
              className="uk-grid-match uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-3@l"
              data-uk-grid=""
              uk-height-match="target: > li .uk-card"
            >
              {offers.map((offer, i) => {
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
                        type={offer.businessLines}
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
                          offer.userOpportunity && offer.userOpportunity.status
                        }
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <ModalOffer
          currentOffer={currentOffer}
          setCurrentOffer={(offer) => {
            setCurrentOffer(offer);
          }}
        />
      </Section>
    </LayoutBackOffice>
  );
};
export default Opportunites;
