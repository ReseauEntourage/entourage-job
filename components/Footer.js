import React from 'react';
import { useRouter } from 'next/router';
import { GridNoSSR, IconNoSSR, Section, SimpleLink } from './utils';
import AssociationEntourage from './partials/AssociationEntourage';
import Partners from './partials/Partners';
import Button from "./utils/Button";
import {EXTERNAL_LINKS} from '../constants';
import {event} from "../lib/gtag";
import TAGS from "../constants/tags";

const Footer = () => {
  const { asPath } = useRouter();
  return (
    <footer id="footer">
      {
        asPath === '/' && <Partners />
      }
      <AssociationEntourage />
      <Section style="secondary" size="small" container='large' preserveColor>
        <GridNoSSR
          middle
          center
          column
          childWidths={['1-1']}
          gap="medium"
        >
          {asPath === '/' && (
            <div className="uk-text-center uk-light">
              <a
                className="ent-logo-hover"
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  style={{
                    fontWeight: 700,
                    color: 'white',
                    fontSize: '16px',
                  }}
                >
                  Linked
                  <span
                    style={{
                      background: '#0077b5',
                      borderRadius: '2px',
                      display: 'inline-block',
                      lineHeight: '17px',
                      marginLeft: '2px',
                      padding: '0 2px',
                    }}
                  >
                    in
                  </span>
                </span>
              </a>
              {' soutient le projet '}
              <span
                style={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '16px',
                }}
              >
                Linked
                <span
                  style={{
                    background: 'rgb(245, 95, 36)',
                    borderRadius: '2px',
                    display: 'inline-block',
                    lineHeight: '17px',
                    marginLeft: '2px',
                    padding: '0 2px',
                  }}
                >
                  out
                </span>
              </span>
              {
                ' porté par l’association Entourage, qui permet le retour à l’emploi des plus précaires. '}
              <span
                style={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: '16px',
                }}
              >
                  Linked
                  <span
                    style={{
                      background: '#0077b5',
                      borderRadius: '2px',
                      display: 'inline-block',
                      lineHeight: '17px',
                      marginLeft: '2px',
                      padding: '0 2px',
                    }}
                  >
                    in
                  </span>
                </span>
                {' soutient les valeurs véhiculées par le dispositif, et se félicite de pouvoir contribuer à son succès en lui faisant bénéficier de la renommée de ses marques.'}
              <p>
                L&apos;usage des marques LinkedOut est autorisé dans le cadre d&apos;une licence consentie par la société LinkedIn Ireland Unlimited.
              </p>
            </div>
          )}
          <GridNoSSR
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
                onClick={() => event(TAGS.FOOTER_DON_CLIC)}
                style='primary'>
                Soutenir LinkedOut{' '}<IconNoSSR name="chevron-right" />
              </Button>
            </div>
            <ul className="uk-padding-small uk-subnav uk-subnav-divider uk-flex-center uk-light">
              <li className="uk-text-capitalize">
                <SimpleLink
                  isExternal
                  target="_blank"
                  href={EXTERNAL_LINKS.LEGAL_MENTIONS}
                >
                  Mentions légales
                </SimpleLink>
              </li>
              <li className="uk-text-capitalize">
                <SimpleLink href="/contact">Contact</SimpleLink>
              </li>
              <li className="uk-text-capitalize">
                <SimpleLink
                  href={EXTERNAL_LINKS.ENTOURAGE}
                  isExternal
                  onClick={() => event(TAGS.FOOTER_SITE_ENTOURAGE_CLIC)}
                  target="_blank">
                  Association Entourage
                </SimpleLink>
              </li>
              <li className="uk-text-capitalize">
                <SimpleLink href="/linkedout">Pourquoi LinkedOut&nbsp;?</SimpleLink>
              </li>
              <li className="uk-text-capitalize">
                <SimpleLink
                  href={EXTERNAL_LINKS.LKO_BLOG}
                  isExternal
                  onClick={() => event(TAGS.FOOTER_BLOG_LINKEDOUT_CLIC)}
                  target="_blank">
                  Actualités
                </SimpleLink>
              </li>
            </ul>
            <div className="uk-flex uk-flex-center">
              <Button
                href="/login"
                style='primary'>
                Espace candidat{' '}<IconNoSSR name="chevron-right" />
              </Button>
            </div>
          </GridNoSSR>
        </GridNoSSR>
      </Section>
    </footer>
  );
};

export default Footer;
