import React from 'react';
import PropTypes from 'prop-types';
/**
 *
 * navbar: bool
 * className: str
 * items: Array<any>
 */
export const Nav = ({ navbar, items }) => (
  <ul className={navbar ? 'uk-navbar-nav' : 'uk-nav uk-nav-default'}>
    {items.map((value) => (
      <li>{value}</li>
    ))}
  </ul>
);
Nav.propTypes = {
  navbar: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.element).isRequired,
};
Nav.defaultProps = {
  navbar: false,
};

/**
 *
 * left: any
 * center: any
 * right: any
 * id: str
 */
export const Navbar = ({ id, left, center, right }) => (
  <nav className="uk-navbar-container" data-uk-navbar id={id}>
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
};
Navbar.defaultProps = {
  id: undefined,
  left: undefined,
  center: undefined,
  right: undefined,
};
