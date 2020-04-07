import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from 'react-share';
import Link from 'next/link';
import { GridNoSSR, IconNoSSR, Section, SimpleLink, ImgNoSSR } from './utils';
import AssociationEntourage from './partials/AssociationEntourage';

const sharedTitle = 'Entourage Jobs';
const sharedDescription =
  "Lorsqu'on est désocialisé, on devient invisible. Les chances de retrouver du travail sont très faibles. Un partage peut tout changer. Eux cherchent du travail , vous avez du réseau.";
const hashtags = ['LinkedOut'];
const sharedURL = process.env.SERVER_URL;
const viaTwitter = 'R_Entourage';

const Footer = () => {
  return (
    <footer id="footer">
      <AssociationEntourage />
      <Section style="secondary" size="small">
        <GridNoSSR childWidths={['1-1']} gap="medium">
          <GridNoSSR
            row
            center
            middle
            // className="uk-text-center"
            childWidths={['1-1', '1-2@m']}
            gap="small"
          >
            <ImgNoSSR
              src="/static/img/03-linkedout-blanc-complet.png"
              alt="logo linkedout"
              width="210px"
            />
            <p>
              <a
                className="ent-logo-hover"
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 83 21"
                  fill="white"
                  style={{ height: '17px', display: 'inline-block' }}
                >
                  <polygon points="0 3.1 3.2 3.1 3.2 14.9 9.2 14.9 9.2 17.9 0 17.9" />
                  <path d="m10.7 7.9h3.1v10h-3.1v-10zm1.5-5c1 0 1.8 0.8 1.8 1.8s-0.8 1.8-1.8 1.8-1.8-0.8-1.8-1.8 0.8-1.8 1.8-1.8" />
                  <polygon points="26.8 3.1 29.9 3.1 29.9 11.9 33.4 7.9 37.2 7.9 33.2 12.5 37.2 17.9 33.3 17.9 29.9 12.9 29.9 12.9 29.9 17.9 26.8 17.9" />
                  <path d="m15.5 7.9h3v1.4c0.6-1 1.7-1.7 2.9-1.6 3.2 0 3.7 2.1 3.7 4.8v5.5h-3.1v-5c0-1.2 0-2.7-1.6-2.7s-1.9 1.3-1.9 2.6v5h-3.1v-10z" />
                  <path d="m43.8 11.7c0-1-0.8-1.9-1.8-1.9h-0.1c-1.1-0.1-2.1 0.8-2.2 1.9h4.1zm2.6 4.5c-1 1.3-2.6 2-4.3 2-3.1 0-5.6-2.1-5.6-5.3s2.5-5.3 5.6-5.3c2.9 0 4.7 2.1 4.7 5.3v1h-7.2c0.2 1.1 1.2 2 2.3 2 0.9 0 1.7-0.5 2.2-1.2l2.3 1.5z" />
                  <path d="m53.4 10.3c-1.6 0-2.5 1-2.5 2.6s0.9 2.6 2.5 2.6 2.5-1 2.5-2.6-0.9-2.6-2.5-2.6m5.4 7.6h-2.9v-1.3c-0.7 1-1.9 1.6-3.1 1.6-3 0-5-2.2-5-5.2 0-2.8 1.7-5.4 4.6-5.4 1.3 0 2.5 0.4 3.2 1.3v-5.8h3.1l0.1 14.8z" />
                  <path d="m81.3 0h-17.9c-0.8 0-1.5 0.7-1.6 1.5v18c0 0.8 0.7 1.5 1.6 1.5h17.9c0.8 0 1.5-0.7 1.6-1.5v-18c0-0.8-0.7-1.5-1.6-1.5zm-13.2 17.9h-3.1v-10h3.1v10zm-1.6-11.4c-1 0-1.8-0.8-1.8-1.8s0.8-1.8 1.8-1.8 1.8 0.8 1.8 1.8-0.8 1.8-1.8 1.8zm13.3 11.4h-3.1v-4.9c0-1.2 0-2.7-1.6-2.7s-1.9 1.3-1.9 2.6v5h-3.1v-10h3v1.4c0.6-1 1.7-1.7 2.9-1.6 3.2 0 3.7 2.1 3.7 4.8l0.1 5.4z" />
                </svg>
              </a>
              {
                ' soutient le projet LinkedOut porté par l’association Entourage, qui permet le retour à l’emploi des plus précaires. LinkedIn soutient les valeurs véhiculées par le dispositif, et se félicite de pouvoir contribuer à son succès en lui faisant bénéficier de la renommée de ses marques.'
              }
            </p>
          </GridNoSSR>
          <GridNoSSR
            row
            center
            middle
            eachWidths={['expand', 'auto@m']}
            gap="small"
          >
            <ul className="uk-subnav uk-subnav-divider uk-flex-left@m uk-flex-center">
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
              <GridNoSSR row middle childWidths={['auto']} gap="small">
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
              <Link href="/login">
                <a
                  type="button"
                  className="uk-button uk-button-primary"
                  style={{
                    color: 'white',
                    backgroundColor: '#F55F24',
                    backgroundImage: 'none',
                    textTransform: 'none',
                    boder: null,
                    padding: '0px 20px',
                    borderRadius: '2px',
                  }}
                >
                  Espace candidat &gt;
                </a>
              </Link>
            </GridNoSSR>
          </GridNoSSR>
        </GridNoSSR>
      </Section>
    </footer>
  );
};

export default Footer;
