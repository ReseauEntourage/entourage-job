import React, { useContext, useState } from 'react';
import PropsType from 'prop-types';
import LayoutBackOffice from '../../components/backoffice/LayoutBackOffice';
import { UserContext } from '../../components/store/UserProvider';
import { Section, GridNoSSR, IconNoSSR } from '../../components/utils';
import OfferCard from '../../components/cards/OfferCard';
import Textarea from '../../components/forms/fields/Textarea';

function randomPhrase(length) {
  const radom13chars = function() {
    return Math.random()
      .toString(16)
      .substring(2, 15);
  };
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

const OfferInfoContainer = ({ icon, title, items }) => (
  <GridNoSSR
    gap="small"
    eachWidths={['auto', 'expand']}
    items={[
      <IconNoSSR name={icon} />,
      <GridNoSSR
        gap="collapse"
        childWidths={['1-1']}
        items={[<span className="uk-text-bold">{title}</span>, ...items]}
      />,
    ]}
  />
);
OfferInfoContainer.propsType = {
  icon: PropsType.string.isRequired,
  title: PropsType.string.isRequired,
  items: PropsType.arrayOf(PropsType.string),
};
OfferInfoContainer.defaultProps = {
  items: [],
};

const ButtonIcon = ({ name, onClick, className }) => (
  <a href="#" onClick={() => onClick()}>
    <IconNoSSR name={name} className={className} />
  </a>
);
ButtonIcon.propsType = {
  name: PropsType.string.isRequired,
  onClick: PropsType.func.isRequired,
  className: PropsType.string,
};
ButtonIcon.defaultProps = {
  className: undefined,
};

let offers;
if (typeof UIkit !== 'undefined') {
  offers = ['private', 'public', 'archive']
    .map((tag, i) =>
      Array(i === 0 ? 4 : i === 1 ? 10 : 15)
        .fill(0)
        .map(() => {
          const isStared = Math.random() >= 0.5;
          return {
            tag,
            isStared,
            isNew: isStared ? false : Math.random() >= 0.5,
            title: randomPhrase(8),
            from: randomPhrase(6),
            shortDescription: randomPhrase(20),
            type: randomPhrase(5),
            message: randomPhrase(250),
            date: randomPhrase(4),
            email: randomPhrase(18),
            phone: randomPhrase(10),
            location: randomPhrase(12),
          };
        })
    )
    .flat()
    .sort((a, b) => b.isNew - a.isNew); // trie par isNew
}

const Opportunites = () => {
  const title = `Mes opportunités`;
  const userContext = useContext(UserContext);
  const [currentOffer, setCurrentOffer] = useState({});
  if (!userContext.isAuthentificated) {
    // Router.push('/login');
    return null;
  }

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
        <hr className="ent-divier-backoffice uk-margin-large-top uk-margin-large-bottom" />
        <div uk-filter="target: .js-filter">
          <ul className="uk-subnav ent-subnav">
            <li uk-filter-control=".tag-private" className="uk-active">
              <a href="#">Mes offres</a>
            </li>
            <li uk-filter-control=".tag-public">
              <a href="#">Toutes les offres</a>
            </li>
            <li uk-filter-control=".tag-archive">
              <a href="#">Offres archivées</a>
            </li>
          </ul>
          <ul
            className="js-filter uk-child-width-1-3@s uk-child-width-1-4@m"
            data-uk-grid="masonry: true"
          >
            {offers.map((offer, i) => (
              <li className={`tag-${offer.tag}`} key={i}>
                <a
                  className="uk-link-reset"
                  onClick={() => {
                    /* global UIkit */
                    setCurrentOffer(offer);

                    UIkit.modal(`#modal-offer`).show();
                  }}
                  aria-hidden
                  role="button"
                >
                  <OfferCard
                    isNew={offer.isNew}
                    isStared={offer.isStared}
                    title={offer.title}
                    from={offer.from}
                    shortDescription={offer.shortDescription}
                    type={offer.type}
                    isArchive={offer.tag === 'archive'}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Modal offer */}
      <div id="modal-offer" data-uk-modal="bg-close:false">
        <div className="uk-modal-dialog uk-width-1-1 uk-width-3-4@m uk-width-2-3@l uk-width-1-2@xl">
          <div className="uk-modal-body">
            <GridNoSSR
              gap="small"
              between
              items={[
                <h3 className="uk-text-bold">{currentOffer.title}</h3>,
                <ul className="uk-iconnav uk-grid-medium">
                  <li>
                    <ButtonIcon name="trash" />
                  </li>
                  <li>
                    <ButtonIcon
                      name="star"
                      onClick={() => {
                        setCurrentOffer({
                          ...currentOffer,
                          isStared: !currentOffer.isStared,
                        });
                      }}
                      className={`${
                        currentOffer.isStared ? 'ent-color-amber' : undefined
                      }`}
                    />
                  </li>
                  <li>
                    <ButtonIcon
                      name="close"
                      onClick={() => UIkit.modal(`#modal-offer`).hide()}
                    />
                  </li>
                </ul>,
              ]}
            />
            <hr />
            <GridNoSSR
              className="uk-margin-bottom"
              eachWidths={['1-3@s', '2-3@s']}
              items={[
                <GridNoSSR
                  gap="medium"
                  items={[
                    <div className="uk-margin-large-left uk-label">
                      {currentOffer.tag}
                    </div>,
                    <OfferInfoContainer
                      icon="hashtag"
                      title="Entreprise"
                      items={[currentOffer.shortDescription]}
                    />,
                    <OfferInfoContainer
                      icon="user"
                      title="Recruteur"
                      items={[
                        currentOffer.from,
                        currentOffer.email,
                        currentOffer.phone,
                        <span className="uk-text-italic">
                          offre soumise le {currentOffer.date}
                        </span>,
                      ]}
                    />,
                    <OfferInfoContainer
                      icon="location"
                      title={currentOffer.location}
                    />,
                  ]}
                />,
                <OfferInfoContainer
                  icon="comment"
                  title="Message"
                  items={[currentOffer.message]}
                />,
              ]}
            />
            <Textarea
              id="modal-offer-comment"
              name="modal-offer-comment"
              title="Ecrivez un commentaire à propos de cette opportunité..."
              type="text"
            />
          </div>
        </div>
      </div>
    </LayoutBackOffice>
  );
};
export default Opportunites;
