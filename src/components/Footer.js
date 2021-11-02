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
import {
  linkedInStyled,
  linkedOutStyled,
} from 'src/components/partials/LinkedInPartial';

const pages = [
  {
    title: 'Découvrez les candidats',
    path: '/candidats',
  },
  {
    title: 'Particuliers, agissez',
    path: '/aider',
  },
  {
    title: 'Entreprises, engagez-vous',
    path: '/entreprises',
    children: [
      {
        title: 'Découvrez les candidats',
        path: '/entreprises/cvs',
      },
      {
        title: 'Recruter hors LinkedOut',
        path: '/entreprises/recruter-hors-linkedout',
      },
      {
        title: 'Devenir une entreprise inclusive',
        path: '/entreprises/sinformer',
      },
    ],
  },
  {
    title: 'Orientez-nous des candidats',
    path: '/orienter',
  },
  {
    title: 'Vous cherchez du travail ?',
    path: '/travailler',
  },
  {
    title: 'Ils construisent le projet avec nous',
    path: '/partenaires',
  },
];

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
                {linkedOutStyled()} est un est un projet porté par
                l&apos;association Entourage, qui permet l’accompagnement des
                personnes les plus précaires ou en situation d’exclusion pour un
                retour à l’emploi. {linkedInStyled()} soutient la mission et les
                valeurs véhiculées par ce dispositif, et a contribué au
                lancement de ce projet en ayant accordé une utilisation limitée
                de sa marque {linkedOutStyled()} par le biais d’une licence.
              </p>
            </div>
          )}
          <Grid
            row
            center
            middle
            eachWidths={['auto@m', 'expand', 'auto@m']}
            gap="collapse"
          >
            <ul className="uk-padding-small uk-subnav uk-flex-center uk-light">
              {pages.map(({ title, path, children }) => {
                return (
                  <li
                    key={path}
                    className="uk-flex uk-flex-column uk-margin-small-bottom"
                  >
                    <SimpleLink
                      className="uk-text-uppercase ent-site-map"
                      href={path}
                    >
                      {title}
                    </SimpleLink>
                    {children &&
                      children.map((childrenPage) => {
                        return (
                          <SimpleLink
                            key={childrenPage.path}
                            href={childrenPage.path}
                            className="uk-text-small uk-text-muted uk-margin-small-top"
                          >
                            {childrenPage.title}
                          </SimpleLink>
                        );
                      })}
                  </li>
                );
              })}
            </ul>
          </Grid>
          <Grid
            row
            center
            middle
            eachWidths={['auto@m', 'expand', 'auto@m']}
            gap="medium"
          >
            <div className="uk-flex uk-flex-center uk-light">
              <Button
                href={EXTERNAL_LINKS.DONATION}
                isExternal
                newTab
                onClick={() => {
                  return event(TAGS.FOOTER_DON_CLIC);
                }}
                style="primary"
              >
                Soutenir LinkedOut <IconNoSSR name="chevron-right" />
              </Button>
            </div>
            <ul className="uk-padding-small uk-subnav uk-flex-center uk-light">
              <li className="uk-text-capitalize uk-text-small">
                <SimpleLink
                  isExternal
                  target="_blank"
                  href={EXTERNAL_LINKS.LEGAL_MENTIONS}
                >
                  Mentions légales
                </SimpleLink>
              </li>
              <li className="uk-text-capitalize uk-text-small">
                <SimpleLink href="/contact">Contact</SimpleLink>
              </li>
              <li className="uk-text-capitalize uk-text-small">
                <SimpleLink
                  href={EXTERNAL_LINKS.ENTOURAGE}
                  isExternal
                  onClick={() => {
                    return event(TAGS.FOOTER_SITE_ENTOURAGE_CLIC);
                  }}
                  target="_blank"
                >
                  Association Entourage
                </SimpleLink>
              </li>
              <li className="uk-text-capitalize uk-text-small">
                <SimpleLink href="/linkedout">
                  Pourquoi LinkedOut&nbsp;?
                </SimpleLink>
              </li>
              <li className="uk-text-capitalize">
                <SimpleLink
                  href={EXTERNAL_LINKS.LKO_BLOG}
                  isExternal
                  onClick={() => {
                    return event(TAGS.FOOTER_BLOG_LINKEDOUT_CLIC);
                  }}
                  target="_blank"
                >
                  Actualités
                </SimpleLink>
              </li>
            </ul>
            <div className="uk-flex uk-flex-center">
              <Button href="/login" style="primary">
                Espace candidat <IconNoSSR name="chevron-right" />
              </Button>
            </div>
          </Grid>
        </Grid>
      </Section>
    </footer>
  );
};

export default Footer;
