import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

export const NavbarNoSSR = dynamic(() => import('./Navbar.js'), { ssr: false });

const Navbar = ({ id, left, center, right, sticky }) => (
  <nav
    className="uk-navbar-container"
    data-uk-navbar
    data-uk-sticky={sticky ? '' : false}
    id={id}
  >
    <div className="uk-navbar-left">{left}</div>
    <div className="uk-navbar-center">{center}</div>
    <div className="uk-navbar-right">{right}</div>
  </nav>
);
Navbar.propTypes = {
  id: PropTypes.number,
  left: PropTypes.element,
  center: PropTypes.element,
  right: PropTypes.element,
  sticky: PropTypes.bool,
};
Navbar.defaultProps = {
  id: undefined,
  left: undefined,
  center: undefined,
  right: undefined,
  sticky: false,
};
export default Navbar;
