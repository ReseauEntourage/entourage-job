import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const NavbarLogo = ({ href, src, alt }) => (
  <Link href={href}>
    <a className="uk-navbar-item uk-logo">
      <img src={src} alt={alt} />
    </a>
  </Link>
);
NavbarLogo.propTypes = {
  src: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  alt: PropTypes.string,
};
NavbarLogo.defaultProps = { alt: 'navbar logo' };
export default NavbarLogo;
