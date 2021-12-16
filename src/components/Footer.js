import React from 'react';
import { useRouter } from 'next/router';
import { Grid, Section, SimpleLink } from 'src/components/utils';
import AssociationEntourage from 'src/components/partials/AssociationEntourage';
import Partners from 'src/components/partials/Partners';
import Button from 'src/components/utils/Button';
import { EXTERNAL_LINKS } from 'src/constants';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';
import { IconNoSSR } from 'src/components/utils/Icon';
import PropTypes from 'prop-types';
import ModalInterestLinkedOut from 'src/components/modals/ModalInterestLinkedOut';
import { openModal } from 'src/components/modals/Modal';

const pages = [
  {
    title: 'Notre mission',
    children: [
      {
        title: 'Pourquoi LinkedOut ?',
        path: '/linkedout',
      },
      {
        title: 'Nos partenaires',
        path: '/partenaires',
      },
      /*
        {
          title: 'Notre histoire',
          path: '/histoire',
        },
      */
      {
        title: 'Devenir partenaire',
        onClick: () => {
          openModal(<ModalInterestLinkedOut />);
        },
        props: {
          isExternal: true,
        },
      },
      /*
        {
          title: 'Nos résultats',
          path: '/resultats',
        },
      */
    ],
  },
  {
    title: "S'engager",
    children: [
      {
        title: 'Entreprises',
        path: '/entreprises',
        children: [
          {
            title: 'Engager mon entreprise',
            path: '/entreprises/sinformer',
          },
          {
            title: 'Recruter',
            path: '/entreprises/cvs',
          },
        ],
      },
      {
        title: 'Particuliers',
        path: '/aider',
      },

      {
        title: 'Travailleurs sociaux',
        path: '/orienter',
      },
      {
        title: 'Candidats',
        path: '/travailler',
      },
    ],
  },
  /* {
    title: 'Territoires',
    children: [
      {
        title: 'Paris',
        path: '/paris',
      },
      {
        title: 'Lyon',
        path: '/lyon',
      },
      {
        title: 'Lille',
        path: '/lille',
      },
    ],
  }, */
  {
    children: [
      {
        title: 'Contact',
        path: '/contact',
      },
      {
        title: 'Nous soutenir',
        path: EXTERNAL_LINKS.DONATION,
        props: {
          isExternal: true,
          newTab: true,
          onClick: () => {
            return event(TAGS.FOOTER_DON_CLIC);
          },
          target: '_blank',
        },
      },
      /*   {
        title: 'Presse',
        path: '/presse',
      }, */
      {
        title: 'Recrutement',
        path: EXTERNAL_LINKS.RECRUITMENTS,
        props: {
          isExternal: true,
          newTab: true,
          onClick: () => {
            return event(TAGS.FOOTER_RECRUITMENTS_CLIC);
          },
          target: '_blank',
        },
      },
      {
        title: 'Actualités',
        path: EXTERNAL_LINKS.LKO_BLOG,
        props: {
          isExternal: true,
          newTab: true,
          onClick: () => {
            return event(TAGS.FOOTER_BLOG_LINKEDOUT_CLIC);
          },
          target: '_blank',
        },
      },
      {
        title: 'Association Entourage',
        path: EXTERNAL_LINKS.ENTOURAGE,
        props: {
          isExternal: true,
          newTab: true,
          onClick: () => {
            return event(TAGS.FOOTER_SITE_ENTOURAGE_CLIC);
          },
          target: '_blank',
        },
      },
      {
        component: (
          <Button
            href="/login"
            style="primary"
            className="uk-margin-medium-top"
          >
            Espace coach & candidat <IconNoSSR name="chevron-right" />
          </Button>
        ),
      },
    ],
  },
];

const SiteMap = ({ isMobile }) => {
  return (
    <Grid
      row
      center
      gap="large"
      childWidths={['1-3@m']}
      className={isMobile ? 'uk-hidden@m' : 'uk-visible@m'}
    >
      {pages.map(({ title, children }, index) => {
        return (
          <div
            key={title + index}
            className="uk-flex uk-flex-column uk-flex-middle uk-margin-small-bottom"
          >
            <div
              className={`uk-flex uk-flex-column ${
                isMobile ? 'uk-flex-middle' : ''
              }`}
            >
              {title && (
                <span className="uk-text-bold ent-site-map">{title}</span>
              )}
              {children &&
                children.map(
                  (
                    {
                      component: childrenComponent,
                      title: childrenTitle,
                      path: childrenPath,
                      onClick: childrenOnClick,
                      children: childrenChildren,
                      props: childrenProps = {},
                    },
                    childrenIndex
                  ) => {
                    if (childrenComponent) {
                      return (
                        <div
                          key={`component${childrenIndex}`}
                          className="ent-site-map"
                        >
                          {childrenComponent}
                        </div>
                      );
                    }
                    return (
                      <React.Fragment key={childrenPath + index}>
                        <SimpleLink
                          onClick={childrenOnClick}
                          href={childrenPath}
                          className={
                            title
                              ? 'uk-text-muted uk-margin-small-top'
                              : 'uk-text-bold ent-site-map'
                          }
                          {...childrenProps}
                        >
                          {childrenTitle}
                        </SimpleLink>

                        {childrenChildren &&
                          childrenChildren.map(
                            (
                              {
                                title: childrenChildrenTitle,
                                path: childrenChildrenPath,
                                props: childrenChildrenProps = {},
                              },
                              childrenChildrenIndex
                            ) => {
                              return (
                                <SimpleLink
                                  key={
                                    childrenChildrenPath + childrenChildrenIndex
                                  }
                                  href={childrenChildrenPath}
                                  className={`${
                                    isMobile ? '' : 'uk-margin-small-left'
                                  } uk-text-small uk-text-muted uk-margin-small-top`}
                                  {...childrenChildrenProps}
                                >
                                  {childrenChildrenTitle}
                                </SimpleLink>
                              );
                            }
                          )}
                      </React.Fragment>
                    );
                  }
                )}
            </div>
          </div>
        );
      })}
    </Grid>
  );
};

SiteMap.propTypes = {
  isMobile: PropTypes.bool.isRequired,
};

const Footer = () => {
  const { asPath } = useRouter();

  const showAssociationEntourage = !asPath.includes('/entreprises');

  return (
    <footer id="footer">
      {asPath === '/' && <Partners />}
      {showAssociationEntourage && <AssociationEntourage />}
      <Section style="secondary" size="small" container="large" preserveColor>
        <Grid middle center column childWidths={['1-1']} gap="medium">
          {asPath === '/' && (
            <div className="uk-text-center uk-light">
              <p>
                LinkedOut est un est un projet porté par l&apos;association
                Entourage, qui permet l’accompagnement des personnes les plus
                précaires ou en situation d’exclusion pour un retour à l’emploi.
                LinkedIn soutient la mission et les valeurs véhiculées par ce
                dispositif, et a contribué au lancement de ce projet en ayant
                accordé une utilisation limitée de sa marque LinkedOut par le
                biais d’une licence.
              </p>
            </div>
          )}
          <SiteMap isMobile />
          <SiteMap isMobile={false} />
          <Grid row center middle gap="collapse">
            <SimpleLink
              isExternal
              target="_blank"
              className="uk-text-small uk-text-muted"
              href={EXTERNAL_LINKS.LEGAL_MENTIONS}
            >
              Mentions légales
            </SimpleLink>
          </Grid>
        </Grid>
      </Section>
    </footer>
  );
};

export default Footer;
