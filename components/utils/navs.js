import React from 'react';

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
