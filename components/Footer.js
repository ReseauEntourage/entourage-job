import React from 'react';
import { GridNoSSR, IconNoSSR, Section, SimpleLink } from './utils';

const Footer = () => {
  return (
    <footer id="footer">
      <Section style="secondary" size="large">
        <GridNoSSR
          childWidths={['1-3']}
          items={[
            <ul className="uk-nav uk-text-uppercase">
              <li>
                <SimpleLink href="/">Mentions légales</SimpleLink>
              </li>
              <li>
                <SimpleLink href="/contact">Contact</SimpleLink>
              </li>
              <li>
                <SimpleLink href="/entourage-social">
                  Entourage social
                </SimpleLink>
              </li>
              <li>
                <SimpleLink href="/about">à propos d&apos;Entourage</SimpleLink>
              </li>
            </ul>,
            <div className="uk-height-1-1 uk-flex uk-flex-center uk-flex-middle">
              <SimpleLink href="/">
                <img
                  src="/static/img/logo-entourage.svg"
                  alt="logo-entourage"
                  className="uk-heigh-small"
                />
              </SimpleLink>
            </div>,
            <div className="uk-height-1-1 uk-flex uk-flex-right uk-flex-middle">
              <ul className="uk-iconnav uk-iconnav-vertical uk-text-center uk-margin-large-left">
                <li>
                  <a href="#">
                    <IconNoSSR name="linkedin" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <IconNoSSR name="facebook" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <IconNoSSR name="twitter" />
                  </a>
                </li>
              </ul>
            </div>,
          ]}
        />
      </Section>
    </footer>
  );
};

export default Footer;
