import React from 'react';
import PropTypes from 'prop-types';

const Nav = ({ navbar, items }) => {
  return (
    <ul className={navbar ? 'uk-navbar-nav' : 'uk-nav uk-nav-default ent-nav'}>
      {items.map((value, index) => {
        return (
          <li key={index} className="ent-nav-item">
            {value}
          </li>
        );
      })}
    </ul>
  );
};
Nav.propTypes = {
  navbar: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.element).isRequired,
};
Nav.defaultProps = {
  navbar: false,
};

export default Nav;
