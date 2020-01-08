/* global UIkit */
import React, { useState } from 'react';
import LayoutBackOffice from '../../components/backoffice/LayoutBackOffice';
import { Section } from '../../components/utils';
import OfferCard from '../../components/cards/OfferCard';
import HeaderBackoffice from '../../components/headers/HeaderBackoffice';
import ModalOffer from '../../components/modals/ModalOffer';

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
            const isBookmark = Math.random() >= 0.5;
            return {
              tag, // todo update the management
              // category
              isBookmark,
              isNew: isBookmark ? false : Math.random() >= 0.5,
              status: '4',
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
      .sort((a, b) => b.isBookmark - a.isBookmark || b.isNew - a.isNew)
      .flat();
  }
  return [];
})();

const Opportunites = () => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentOffer, setCurrentOffer] = useState({});
  const [offers, setOffers] = useState(offersBase);

  return (
    <LayoutBackOffice title="Mes opportunités">
      <Section>
        <HeaderBackoffice
          title="Consulte toutes tes opportunités de travail"
          description="Parcours les offres qui t&rsquo;ont été adressées directement ainsi que celles communes aux différents candidats du parcours LinkedOut."
        />
        {/* revoir le filtrage, utiliser des data */}
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
            {offers.map((offer, i) => (
              <li className={`tag-${offer.tag}`} key={i}>
                <a
                  className="uk-link-reset"
                  onClick={() => {
                    if (offer.isNew) {
                      offers[i].isNew = false;
                    }

                    setCurrentIndex(i);
                    setCurrentOffer(offer);

                    UIkit.modal('#modal-offer').show();
                  }}
                  aria-hidden
                  role="button"
                >
                  <OfferCard
                    isNew={offer.isNew}
                    isStared={offer.isBookmark}
                    title={offer.title}
                    from={offer.recruiterName}
                    shortDescription={offer.company}
                    type={offer.businessLine}
                    tag={offer.tag}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <ModalOffer
          currentOffer={currentOffer}
          setCurrentOffer={(offer) => {
            setCurrentOffer(offer);
            offers[currentIndex] = offer;
            setOffers(
              offers.sort(
                (a, b) => b.isBookmark - a.isBookmark || b.isNew - a.isNew
              )
            );
          }}
        />
      </Section>
    </LayoutBackOffice>
  );
};
export default Opportunites;
