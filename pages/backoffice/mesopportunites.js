import React, { useContext } from 'react';
import LayoutBackOffice from '../../components/backoffice/LayoutBackOffice';
import { UserContext } from '../../components/store/UserProvider';
import { Section } from '../../components/utils';
import OfferCard from '../../components/cards/OfferCard';

const Opportunites = () => {
  const title = `Mes opportunités`;
  const userContext = useContext(UserContext);
  if (!userContext.isAuthentificated) {
    // Router.push('/login');
    return null;
  }
  const offers = ['tag-private', 'tag-public', 'tag-archive']
    .map((tag, i) =>
      Array(i === 0 ? 4 : i === 1 ? 10 : 15)
        .fill(0)
        .map(() => ({
          tag,
          isStared: Math.random() >= 0.5,
          isNew: i !== 2 ? Math.random() >= 0.5 : false,
          title: Math.round(Math.random() * 100000000).toString(),
          from: Math.round(Math.random() * 1000000).toString(),
          shortDescription: Math.round(
            Math.random() * 10000000000000000000
          ).toString(),
          type: Math.round(Math.random() * 100000).toString(),
        }))
    )
    .flat()
    .sort((a, b) => b.isNew - a.isNew); // trie par new
  return (
    <LayoutBackOffice title={title}>
      <Section>
        <h2 className="uk-text-bold">
          Consulte toutes tes opportunités de travail
        </h2>
        <p className="uk-text-lead uk-width-2-3@m">
          Parcours les offres qui t&rsquo;ont été adressées directement ainsi
          que celles communes aux différents candidats du parcours LinkedOut.
        </p>
      </Section>
      <hr className="ent-divier-backoffice" />
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
            {offers.map((offer, i) => (
              <li className={offer.tag} key={i}>
                <OfferCard
                  isNew={offer.isNew}
                  isStared={offer.isStared}
                  title={offer.title}
                  from={offer.from}
                  shortDescription={offer.shortDescription}
                  type={offer.type}
                  isArchive={offer.tag === 'tag-archive'}
                />
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </LayoutBackOffice>
  );
};

export default Opportunites;
