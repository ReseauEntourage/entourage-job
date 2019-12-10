import React, { useContext } from 'react';
import LayoutBackOffice from '../../components/backoffice/LayoutBackOffice';
import { UserContext } from '../../components/store/UserProvider';
import { Button, Section, IconNoSSR, GridNoSSR } from '../../components/utils';
import './mesopportunites.less';

const Opportunites = () => {
  const title = `Mes opportunités`;
  const userContext = useContext(UserContext);
  if (!userContext.isAuthentificated) {
    // Router.push('/login');
    return null;
  }
  return (
    <LayoutBackOffice title={title}>
      <div style={{ position: 'relative' }}>
        <Section className="uk-padding-remove-bottom">
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
          <hr
            className="uk-margin-medium-top"
            style={{ borderTop: '1px solid black' }}
          />
        </Section>

        {/* <div uk-grid>
          {[
            { title: 'Manipulateur en laboratoire', name: 'Cindy Langlais' },
          ].map((offer) => (
            <div className="uk-card">
              <div className="uk-card-body">{offer.title}</div>
            </div>
          ))}
        </div> */}
        <Section>
          <div uk-filter="target: .js-filter">
            <ul className="uk-subnav ent-subnav">
              <li uk-filter-control=".tag-white">
                <a href="#">Mes offres</a>
              </li>
              <li uk-filter-control="">
                <a href="#">Toutes les offres</a>
              </li>
              <li uk-filter-control=".tag-black">
                <a href="#">Offres archives</a>
              </li>
            </ul>

            <ul
              className="js-filter uk-child-width-1-2@s uk-child-width-1-3@m uk-text-center"
              data-uk-grid
            >
              {['tag-white', 'tag-blue', 'tag-black']
                .map((tag) =>
                  Array(4)
                    .fill(0)
                    .map(() => (
                      <li className={tag}>
                        <a className="uk-link-reset" href="#">
                          <div
                            className={`uk-text-left uk-card uk-card-hover uk-card-body uk-card-${
                              tag === 'tag-white'
                                ? 'default'
                                : tag === 'tag-black'
                                ? 'secondary'
                                : 'primary'
                            }`}
                          >
                            <IconNoSSR name="star" className="uk-card-badge" />
                            <h5 className="uk-text-bold">
                              Manipulateur en laboratoire
                            </h5>
                            <div
                              className="uk-margin-large-top uk-margin-large-bottom uk-grid-small"
                              data-uk-grid
                            >
                              <div>
                                <IconNoSSR name="user" />
                                <span className="uk-margin-small-left">
                                  Cindy Langlais
                                </span>
                              </div>
                              <div>
                                <IconNoSSR name="hashtag" />
                                <span className="uk-margin-small-left">
                                  Laboratoire d&apos;essai des matériaux de la
                                  ville de Paris
                                </span>
                              </div>
                            </div>
                            <div className="uk-width-1-1 uk-flex uk-flex-middle uk-flex-between">
                              <div>
                                <Button disabled>Laboratoire</Button>
                              </div>
                              <div>
                                <a className="uk-link-muted" href="">
                                  voir l'offre
                                </a>
                              </div>
                            </div>
                          </div>
                        </a>
                      </li>
                    ))
                )
                .flat()}
            </ul>
          </div>
        </Section>
      </div>
    </LayoutBackOffice>
  );
};

export default Opportunites;
