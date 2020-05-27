import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from 'react-share';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GridNoSSR, IconNoSSR, Section, SimpleLink, ImgNoSSR } from './utils';
import AssociationEntourage from './partials/AssociationEntourage';
import Button from "./utils/Button";

const sharedTitle = 'Entourage Jobs';
const sharedDescription =
  "Lorsqu'on est désocialisé, on devient invisible. Les chances de retrouver du travail sont très faibles. Un partage peut tout changer. Eux cherchent du travail , vous avez du réseau.";
const hashtags = ['LinkedOut'];
const sharedURL = process.env.SERVER_URL;
const viaTwitter = 'R_Entourage';

const Footer = () => {
  const { asPath } = useRouter();
  return (
    <footer id="footer">
      <AssociationEntourage />
      <Section style="secondary" size="small" preserveColor>
        <GridNoSSR
          middle
          center
          column
          eachWidths={['3-4', '1-1']}
          gap="medium"
        >
          {asPath === '/' && (
            <p className="uk-text-center uk-light">
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
                ' porté par l’association Entourage, qui permet le retour à l’emploi des plus précaires. LinkedIn soutient les valeurs véhiculées par le dispositif, et se félicite de pouvoir contribuer à son succès en lui faisant bénéficier de la renommée de ses marques.'
              }
            </p>
          )}
          <GridNoSSR
            row
            center
            middle
            eachWidths={['expand', 'auto@m']}
            gap="small"
          >
            <ul className="uk-subnav uk-subnav-divider uk-flex-left@m uk-flex-center uk-light">
              <li className="uk-text-capitalize">
                <SimpleLink href="/">Mentions légales</SimpleLink>
              </li>
              <li className="uk-text-capitalize">
                <SimpleLink href="/contact">Contact</SimpleLink>
              </li>
              <li className="uk-text-capitalize">
                <SimpleLink href="https://www.entourage.social" isExternal>
                  Entourage social
                </SimpleLink>
              </li>
            </ul>
            <GridNoSSR row middle className="uk-flex-right@m uk-flex-center">
              <GridNoSSR row middle childWidths={['auto']} gap="small" className="uk-light">
                <div>Partager</div>
                <FacebookShareButton
                  className="uk-icon-button uk-icon-link"
                  url={sharedURL}
                  quote={sharedDescription}
                  hashtags={hashtags}
                  style={{ cursor: 'pointer' }}
                >
                  <IconNoSSR name="facebook" />
                </FacebookShareButton>
                <LinkedinShareButton
                  className="uk-icon-button uk-icon-link"
                  url={sharedURL}
                  title={sharedTitle}
                  description={sharedDescription}
                  style={{ cursor: 'pointer' }}
                >
                  <IconNoSSR name="linkedin" />
                </LinkedinShareButton>
                <TwitterShareButton
                  url={sharedURL}
                  title={sharedDescription}
                  hashtags={hashtags}
                  via={viaTwitter}
                  style={{ cursor: 'pointer' }}
                  className="uk-icon-button uk-icon-link"
                >
                  <IconNoSSR name="twitter" />
                </TwitterShareButton>
              </GridNoSSR>
              <Button
                href="/login"
                style='primary'>
                Espace candidat &gt;
              </Button>
            </GridNoSSR>
          </GridNoSSR>
        </GridNoSSR>
      </Section>
    </footer>
  );
};

export default Footer;
