import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { ImgNoSSR } from './Img';

const NavbarLogo = ({ href, src, alt, style, alwaysVisible }) => (
  <Link href={href}>
    <a // info: regle css sur uk-logo
      className={`uk-navbar-item uk-width-small ${!alwaysVisible &&
        'uk-logo uk-animation-fade'}`}
      style={style}
    >
      <ImgNoSSR src={src} alt={alt} />
    </a>
  </Link>
);
NavbarLogo.propTypes = {
  src: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  alt: PropTypes.string,
  style: PropTypes.shape(),
  alwaysVisible: PropTypes.bool
};
NavbarLogo.defaultProps = { alt: 'navbar logo', style: {}, alwaysVisible: false};
export default NavbarLogo;
