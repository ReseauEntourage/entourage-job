import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

const Navbar = ({ id, left, center, right, sticky, className, mode }) => {
  return (
    <nav
      className={`uk-navbar-container ${className}`}
      data-uk-navbar={mode ? `mode: ${mode}` : ''}
      data-uk-sticky={sticky}
      id={id}
    >
      <div className="uk-navbar-left">{left}</div>
      <div className="uk-navbar-center">{center}</div>
      <div className="uk-navbar-right">{right}</div>
    </nav>
  );
};
Navbar.propTypes = {
  id: PropTypes.number,
  left: PropTypes.element,
  center: PropTypes.element,
  right: PropTypes.element,
  sticky: PropTypes.string,
  className: PropTypes.string,
  mode: PropTypes.string,
};
Navbar.defaultProps = {
  id: undefined,
  left: undefined,
  center: undefined,
  right: undefined,
  sticky: undefined,
  className: undefined,
  mode: undefined,
};

export const NavbarNoSSR = dynamic(
  () => {
    return import('src/components/utils/Navbar');
  },
  { ssr: false }
);

export default Navbar;
