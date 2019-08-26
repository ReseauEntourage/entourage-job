import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  UIKIT_SCREENS,
  UIKIT_BUTTON_STYLES_SPEC,
  UIKIT_BUTTON_SIZES,
} from '../variables';

export const Button = ({
  visible,
  style,
  size,
  href,
  disabled,
  widths,
  children,
}) => {
  let classBuffer = 'uk-button';
  if (visible) classBuffer += ` uk-visible@${visible}`;
  if (style) classBuffer += ` uk-button-${style}`;
  if (size) classBuffer += ` uk-button-${size}`;
  widths.forEach((width) => {
    classBuffer += ` uk-width-${width}`;
  });
  return (
    <Link href={href}>
      <button className={classBuffer} disabled={disabled} type="button">
        {children}
      </button>
    </Link>
  );
};
Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  href: PropTypes.string,
  disabled: PropTypes.bool,
  visible: PropTypes.oneOf(UIKIT_SCREENS),
  style: PropTypes.oneOf(UIKIT_BUTTON_STYLES_SPEC),
  size: PropTypes.oneOf(UIKIT_BUTTON_SIZES),
  widths: PropTypes.arrayOf(PropTypes.string), // UIKIT_WIDTH_SCREENS
};
Button.defaultProps = {
  disabled: false,
  visible: undefined,
  style: undefined,
  size: undefined,
  href: '#',
  widths: [],
};

export const NavbarLogo = ({ href, src, alt }) => (
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

export const SimpleLink = ({ visible, href, children }) => {
  let classBuffer = '';
  if (visible) classBuffer += ` uk-visible@${visible}`;
  return (
    <Link href={href}>
      <a className={classBuffer}>{children}</a>
    </Link>
  );
};
SimpleLink.propTypes = {
  href: PropTypes.string.isRequired,
  visible: PropTypes.oneOf(UIKIT_SCREENS),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
SimpleLink.defaultProps = { visible: undefined };
