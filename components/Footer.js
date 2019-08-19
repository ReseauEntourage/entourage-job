import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Section, SimpleLink } from './utils';

/**
 *
 * links: Array<{href: str, name: str}>
 */
const Footer = ({ items }) => {
  return (
    <footer id="footer">
      {/* className="uk-section uk-section-secondary" */}
      <Section style="secondary" size="large">
        <Grid
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
                    <span data-uk-icon="linkedin" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span data-uk-icon="facebook" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <span data-uk-icon="twitter" />
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
Footer.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      key: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
};

export default Footer;
