/** @format */

import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { UIKIT_SCREENS, UIKIT_STYLES, UIKIT_BUTTON_STYLES_SPEC, UIKIT_SIZE } from '../variables';

export const Button = ({ visible, style, size, href, disabled, children }) => {
  let classBuffer = 'uk-button';
  if (UIKIT_SCREENS.includes(visible)) {
    classBuffer += ` uk-visible@${visible}`;
  }
  if (UIKIT_STYLES.includes(style) || UIKIT_BUTTON_STYLES_SPEC.includes(style)) {
    classBuffer += ` uk-button-${style}`;
  }
  if (UIKIT_SIZE.includes(size)) {
    classBuffer += ` uk-button-${size}`;
  }
  return (
    <Link href={href}>
      <button className={classBuffer} disabled={disabled} type="button">
        {children}
      </button>
    </Link>
  );
};
Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  disabled: PropTypes.bool,
  visible: PropTypes.string,
  style: PropTypes.string,
  href: PropTypes.string,
};
Button.defaultProps = {
  disabled: false,
  visible: undefined,
  style: undefined,
  href: undefined,
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

export const Hamburger = ({ hidden }) => {
  let classBuffer = '';
  if (UIKIT_SCREENS.includes(hidden)) {
    classBuffer += `uk-hidden@${hidden}`;
  }

  return <button className={`uk-navbar-toggle ${classBuffer}`} type="button" data-uk-toggle="target: #offcanvas" data-uk-navbar-toggle-icon />;
};
Hamburger.propTypes = { hidden: PropTypes.bool };
Hamburger.defaultProps = { hidden: false };

export const SimpleLink = ({ visible, href, children }) => {
  let classBuffer = '';
  if (UIKIT_SCREENS.includes(visible)) {
    classBuffer += ` uk-visible@${visible}`;
  }

  return (
    <Link href={href}>
      <a className={classBuffer}>{children}</a>
    </Link>
  );
};
SimpleLink.propTypes = {
  visible: PropTypes.bool,
  href: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
SimpleLink.defaultProps = { visible: false };
