import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  UIKIT_SCREENS,
  UIKIT_BUTTON_STYLES_SPEC,
  UIKIT_BUTTON_SIZES,
} from 'src/components/variables';

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
  newTab,
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
  if (href) {
    return isExternal ? (
      <a
        href={href}
        target={newTab ? '_blank' : ''}
        rel={newTab ? 'noopener' : ''}
      >
        {buttonComponent}
      </a>
    ) : (
      <Link href={href}>{buttonComponent}</Link>
    );
  }
  return buttonComponent;
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
  newTab: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  toggle: PropTypes.string,
};
Button.defaultProps = {
  disabled: false,
  visible: undefined,
  style: undefined,
  size: undefined,
  href: undefined,
  widths: [],
  isExternal: false,
  newTab: false,
  className: undefined,
  onClick: () => {},
  toggle: undefined,
};

export default Button;
