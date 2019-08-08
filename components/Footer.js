import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from './utils/navs';
import { SimpleLink } from './utils/links';

/**
 *
 * links: Array<{href: str, name: str}>
 */
const Footer = ({ items }) => {
  return (
    <footer className="uk-section uk-section-secondary" id="footer">
      <div className="uk-container">
        <Nav
          navbar
          items={[
            items.map(({ href, name }) => (
              <SimpleLink href={href}>{name}</SimpleLink>
            )),
          ]}
        />
      </div>
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
