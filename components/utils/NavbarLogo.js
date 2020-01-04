import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { ImgNoSSR } from './Img';

const NavbarLogo = ({ href, src, alt, alwaysVisible }) => (
  <Link href={href}>
    <a // info: regle css sur uk-logo
      className={`uk-navbar-item uk-width-small ${!alwaysVisible && 'uk-logo'}`}
    >
      <ImgNoSSR src={src} alt={alt} />
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
