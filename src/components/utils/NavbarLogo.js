import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Img from 'src/components/utils/Img';

const NavbarLogo = ({ href, src, alt, style, alwaysVisible }) => {
  return (
    <Link href={href} passHref>
      <div style={{ width: 180 }}>
        <a // info: regle css sur uk-logo
          className={`uk-navbar-item ${
            !alwaysVisible && 'uk-logo uk-animation-fade'
          }`}
          style={style}
        >
          <Img src={src} alt={alt} />
        </a>
      </div>
    </Link>
  );
};
NavbarLogo.propTypes = {
  src: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  alt: PropTypes.string,
  style: PropTypes.shape(),
  alwaysVisible: PropTypes.bool,
};
NavbarLogo.defaultProps = {
  alt: 'navbar logo',
  style: {},
  alwaysVisible: false,
};
export default NavbarLogo;
