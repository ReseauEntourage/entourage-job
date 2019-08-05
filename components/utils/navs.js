import React from 'react';

/**
 *
 * navbar: bool
 * className: str
 * items: Array<any>
 */
export const Nav = props => (
  <ul className={props.navbar ? 'uk-navbar-nav' : 'uk-nav uk-nav-default'}>
    {props.items.map((value, key) => (
      <li key={key}>{value}</li>
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
export const Navbar = props => (
  <nav className="uk-navbar-container" data-uk-navbar id={props.id}>
    <div className="uk-navbar-left">{props.left}</div>
    <div className="uk-navbar-center">{props.center}</div>
    <div className="uk-navbar-right">{props.right}</div>
  </nav>
);
