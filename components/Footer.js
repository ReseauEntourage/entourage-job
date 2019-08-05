import React from 'react';
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
          items={items.map(value => (
            <SimpleLink href={value.href}>{value.name}</SimpleLink>
          ))}
          navbar
         />
      </div>
    </footer>
  );
};

export default Footer;
