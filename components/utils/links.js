import React from 'react';
import Link from 'next/link';
import { UIKIT_SCREENS, UIKIT_STYLES, UIKIT_BUTTON_STYLE_SPEC } from '../variables';

export const Button = ({ visible, style, href, disabled, children }) => {
  let classBuffer = 'uk-button';
  if (visible) {
    if (UIKIT_SCREENS.includes(visible)) {
      classBuffer += ` uk-visible@${visible}`;
    } else {
      console.error(
        "Component attribute 'visible' invalid. It must be one of thoses char: (s, m, l, xl)"
      );
    }
  }
  if (style) {
    if (UIKIT_STYLES.includes(style) || UIKIT_BUTTON_STYLE_SPEC.includes(style)) {
      classBuffer += ` uk-button-${style}`;
    } else {
      console.error(
        "Component attribute 'style' invalid. It must be a correct uikit style." +
          ' Please look at the doc https://getuikit.com/docs/button'
      );
    }
  }
  return (
    <Link href={href}>
      <button className={classBuffer} disabled={disabled} type="button">
        {children}
      </button>
    </Link>
  );
};

export const NavbarLogo = ({ href, src, alt }) => (
  <Link href={href}>
    <a className="uk-navbar-item uk-logo">
      <img src={src} alt={alt} />
    </a>
  </Link>
);

export const Hamburger = ({ hidden }) => {
  let classBuffer = '';
  if (hidden) {
    if (UIKIT_SCREENS.includes(hidden)) {
      classBuffer += `uk-hidden@${hidden}`;
    } else {
      console.error(
        "Component attribute 'hidden' invalid. It must be one of thoses char: (s, m, l, xl)"
      );
    }
  }

  return (
    <button
      data-uk-navbar-toggle-icon
      data-uk-toggle="target: #offcanvas"
      className={`uk-navbar-toggle ${classBuffer}`}
      type="button"
    />
  );
};

export const SimpleLink = ({ visible, href, children }) => {
  let classBuffer = '';
  if (visible) {
    if (UIKIT_SCREENS.includes(visible)) {
      classBuffer += ` uk-visible@${visible}`;
    } else {
      console.error(
        "Component attribute 'visible' invalid. It must be one of thoses char: (s, m, l, xl)"
      );
    }
  }

  return (
    <Link href={href}>
      <a className={classBuffer}>{children}</a>
    </Link>
  );
};
