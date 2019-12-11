import React, { useContext } from 'react';
import { Router } from 'next/router';
import LayoutBackOffice from '../../components/backoffice/LayoutBackOffice';
import { UserContext } from '../../components/store/UserProvider';
import { Section } from '../../components/utils';
import OfferCard from '../../components/cards/OfferCard';
import './mesopportunites.less';

const Opportunites = () => {
  const title = `Mes opportunités`;
  const userContext = useContext(UserContext);
  if (!userContext.isAuthentificated) {
    // Router.push('/login');
    return null;
  }
  const offers = ['tag-private', 'tag-public', 'tag-archive']
    .map((tag, i) =>
      Array(2 + i)
        .fill(0)
        .map(() => ({
          tag,
          isStared: Math.random() >= 0.5,
          isNew: Math.random() >= 0.5,
          title: Math.round(Math.random() * 100000000),
          from: Math.round(Math.random() * 1000000),
          shortDescription: Math.round(Math.random() * 10000000000000000000),
          type: Math.round(Math.random() * 100000),
        }))
    )
    .flat()
    .sort((a, b) => b.isNew - a.isNew); // trie par new
  return (
    <LayoutBackOffice title={title}>
      <div style={{ position: 'relative' }}>
        <Section>
          <h2 className="uk-text-bold">
            Consulte toutes tes opportunités de travail
          </h2>
          <div className="uk-grid-match" data-uk-grid>
            <div className="uk-width-2-3@m">
              <p className="uk-text-lead">
                Parcours les offres qui t&rsquo;ont été adressées directement
                ainsi que celles communes aux différents candidats du parcours
                LinkedOut.
              </p>
            </div>
          </div>
        </Section>
        <div className="uk-container">
          <hr style={{ borderTop: '1px solid black' }} />
        </div>
        <Section>
          <div uk-filter="target: .js-filter">
            <ul className="uk-subnav ent-subnav">
              <li uk-filter-control=".tag-private">
                <a href="#">Mes offres</a>
              </li>
              <li uk-filter-control=".tag-public" className="uk-active">
                <a href="#">Toutes les offres</a>
              </li>
              <li uk-filter-control=".tag-archive">
                <a href="#">Offres archivées</a>
              </li>
            </ul>

            <ul
              className="js-filter uk-child-width-1-2@s uk-child-width-1-3@m"
              data-uk-grid
            >
              {offers.map((offer) => (
                <li className={offer.tag}>
                  <OfferCard
                    isNew={offer.isNew}
                    isStared={offer.isStared}
                    title={offer.title}
                    from={offer.from}
                    shortDescription={offer.shortDescription}
                    type={offer.type}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </div>
    </LayoutBackOffice>
  );
};

export default Opportunites;
