import React from 'react';
import { GridNoSSR, IconNoSSR, Section, SimpleLink, ImgNoSSR } from './utils';

const Footer = () => {
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
              <SimpleLink href="https://www.entourage.social">
                Entourage social
              </SimpleLink>
            </div>,
            <div className="uk-h4 uk-text-center">
              <SimpleLink href="/about">À propos d&apos;Entourage</SimpleLink>
            </div>,
          ]}
        />
        <div className="uk-flex-center uk-flex uk-flex-middle uk-margin-top">
          <SimpleLink href="https://www.entourage.social">
            <ImgNoSSR
              src="/static/img/logo-entourage.svg"
              alt="logo-entourage"
              className="uk-padding"
            />
          </SimpleLink>
          <hr className="uk-divider-vertical uk-margin-small-right uk-margin-small-left" />
          <div className="uk-flex-center uk-flex uk-flex-middle">
            <SimpleLink
              className="uk-link-muted uk-padding-small"
              href="https://www.linkedin.com/company/association-entourage/"
              target="_blank"
            >
              <IconNoSSR name="linkedin" ratio={2} />
            </SimpleLink>
            <SimpleLink
              className="uk-link-muted uk-padding-small"
              href="https://www.facebook.com/EntourageReseauCivique/"
              target="_blank"
            >
              <IconNoSSR name="facebook" ratio={2} />
            </SimpleLink>
            <SimpleLink
              className="uk-link-muted uk-padding-small"
              href="https://twitter.com/r_entourage/"
              target="_blank"
            >
              <IconNoSSR name="twitter" ratio={2} />
            </SimpleLink>
          </div>
        </div>
      </Section>
    </footer>
  );
};

export default Footer;
