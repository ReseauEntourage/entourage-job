import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  UIKIT_SCREENS,
  UIKIT_BUTTON_STYLES_SPEC,
  UIKIT_BUTTON_SIZES,
} from '../variables';

const Button = ({
  visible,
  style,
  size,
  href,
  disabled,
  widths,
  children,
  className,
  isExternal,
  onClick,
  toggle,
}) => {
  let classBuffer = 'uk-button';
  if (visible) classBuffer += ` uk-visible@${visible}`;
  if (style) classBuffer += ` uk-button-${style}`;
  if (size) classBuffer += ` uk-button-${size}`;
  if (className) classBuffer += ` ${className}`;
  widths.forEach((width) => {
    classBuffer += ` uk-width-${width}`;
  });

  const buttonComponent = (
    <button
      className={classBuffer}
      disabled={disabled}
      type="button"
      onClick={onClick}
      data-uk-toggle={toggle}
    >
      {children}
    </button>
  );

  return isExternal ? (
    <a href={href}>{buttonComponent}</a>
  ) : (
    <Link href={href}>{buttonComponent}</Link>
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
  isExternal: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  toggle: PropTypes.string,
};
Button.defaultProps = {
  disabled: false,
  visible: undefined,
  style: undefined,
  size: undefined,
  href: '#',
  widths: [],
  isExternal: false,
  className: undefined,
  onClick: undefined,
  toggle: undefined,
};

export default Button;
