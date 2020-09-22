import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { UIKIT_SCREENS, UIKIT_BUTTON_STYLES_SPEC, UIKIT_BUTTON_SIZES } from '../variables';

const Button = ({
  children,
  className,
  disabled,
  href,
  isExternal,
  newTab,
  onClick,
  size,
  style,
  toggle,
  visible,
  widths,
}) => {
  let classBuffer = 'uk-button';
  if (visible) classBuffer += ` uk-visible@${visible}`;
  if (style) classBuffer += ` uk-button-${style}`;
  if (size) classBuffer += ` uk-button-${size}`;
  if (className) classBuffer += ` ${className}`;
  widths.forEach(width => {
    classBuffer += ` uk-width-${width}`;
  });
  const buttonComponent = <button className={classBuffer} disabled={disabled} type="button" onClick={onClick} data-uk-toggle={toggle}>
    {children}
  </button>;

  if (href) {
    return isExternal ? <a href={href} target={newTab ? '_blank' : ''} rel={newTab ? 'noopener noreferrer' : ''}>
      {buttonComponent}
    </a> : <Link href={href}>{buttonComponent}</Link>;
  }

  return buttonComponent;
};

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  isExternal: PropTypes.bool,
  newTab: PropTypes.bool,
  style: PropTypes.oneOf(UIKIT_BUTTON_STYLES_SPEC),
  size: PropTypes.oneOf(UIKIT_BUTTON_SIZES),
  onClick: PropTypes.func,
  toggle: PropTypes.string,
  visible: PropTypes.oneOf(UIKIT_SCREENS),
  widths: PropTypes.arrayOf(PropTypes.string)
};
Button.defaultProps = {
  className: undefined,
  disabled: false,
  href: undefined,
  isExternal: false,
  newTab: false,
  onClick: undefined,
  size: undefined,
  style: undefined,
  toggle: undefined,
  visible: undefined,
  widths: [],
};
export default Button;