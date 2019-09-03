import React from 'react';
import { GridNoSSR, IconNoSSR, Section, SimpleLink, ImgNoSSR } from './utils';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from 'react-share';

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
                <ImgNoSSR
                  src="/static/img/logo-entourage.svg"
                  alt="logo-entourage"
                  className="uk-heigh-small"
                />
              </SimpleLink>
              <LinkedinShareButton />
            </div>,
            <div className="uk-height-1-1 uk-flex uk-flex-right uk-flex-middle">
              <ul className="uk-iconnav uk-iconnav-vertical uk-text-center uk-margin-large-left">
                <li>
                  <LinkedinShareButton url="https://www.linkedout.fr" className="uk-link-muted" style={{ cursor: "pointer" }}>
                    <IconNoSSR name="linkedin" />
                  </LinkedinShareButton>
                </li>
                <li>
                  <FacebookShareButton url="https://www.linkedout.fr" className="uk-link-muted" style={{ cursor: "pointer" }}>
                    <IconNoSSR name="facebook" />
                  </FacebookShareButton>
                </li>
                <li>
                  <TwitterShareButton url="https://www.linkedout.fr" className="uk-link-muted" style={{ cursor: "pointer" }}>
                    <IconNoSSR name="twitter" />
                  </TwitterShareButton>
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
