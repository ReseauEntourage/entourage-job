import React from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from 'react-share';
import { GridNoSSR, IconNoSSR, Section, SimpleLink, ImgNoSSR } from './utils';

const Footer = () => {
  const sharedURL = 'https://www.linkedout.fr/';
  const sharedText =
    "Lorsqu'on est désocialisé, on devient invisible. Les chances de retrouver du travail sont très faibles. Un partage peut tout changer. Eux cherchent du travail , vous avez du réseau.";
  return (
    <footer id="footer">
      <Section style="secondary" size="medium">
        <GridNoSSR
          childWidths={['1-4@s', '1-2']}
          center
          match
          items={[
            <div className="uk-h4 uk-text-center">
              <SimpleLink href="/">Mentions légales</SimpleLink>
            </div>,
            <div className="uk-h4 uk-text-center">
              <SimpleLink href="/contact">Contact</SimpleLink>
            </div>,
            <div className="uk-h4 uk-text-center">
              <SimpleLink href="/entourage-social">Entourage social</SimpleLink>
            </div>,
            <div className="uk-h4 uk-text-center">
              <SimpleLink href="/about">À propos d&apos;Entourage</SimpleLink>
            </div>,
          ]}
        />
        <div className="uk-flex-center uk-flex uk-flex-middle uk-margin-top">
          <SimpleLink href="/">
            <ImgNoSSR
              src="/static/img/logo-entourage.svg"
              alt="logo-entourage"
              className="uk-padding"
            />
          </SimpleLink>
          <hr className="uk-divider-vertical uk-margin-small-right uk-margin-small-left" />
          <div className="uk-flex-center uk-flex uk-flex-middle">
            <LinkedinShareButton
              className="uk-link-muted uk-padding-small"
              url={sharedURL}
              style={{ cursor: 'pointedr' }}
            >
              <IconNoSSR name="linkedin" ratio={2} />
            </LinkedinShareButton>
            <FacebookShareButton
              className="uk-link-muted uk-padding-small"
              url={sharedURL}
              quote={sharedText}
              style={{ cursor: 'pointer' }}
            >
              <IconNoSSR name="facebook" ratio={2} />
            </FacebookShareButton>
            <TwitterShareButton
              className="uk-link-muted uk-padding-small"
              url={sharedURL}
              title={sharedText}
              style={{ cursor: 'pointer' }}
            >
              <IconNoSSR name="twitter" ratio={2} />
            </TwitterShareButton>
          </div>
        </div>
      </Section>
    </footer>
  );
};

export default Footer;
