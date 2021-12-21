/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { UIKIT_SCREENS } from 'src/components/variables';

const SimpleLink = ({
  visible,
  href,
  as,
  children,
  className,
  target,
  scroll,
  isExternal,
  shallow,
  onClick,
  toggle,
}) => {
  let classBuffer = '';
  if (visible) classBuffer += ` uk-visible@${visible}`;
  if (className) classBuffer += ` ${className}`;

  if (toggle) {
    return (
      <a onClick={onClick} className={classBuffer} data-uk-toggle={toggle}>
        {children}
      </a>
    );
  }
  return isExternal ? (
    <a
      onClick={onClick}
      href={href}
      target={target ? '_blank' : ''}
      className={classBuffer}
      rel={target ? 'noopener' : ''}
    >
      {children}
    </a>
  ) : (
    <Link scroll={scroll} href={href} as={as} shallow={shallow}>
      <a
        onClick={onClick}
        target={target}
        className={classBuffer}
        rel={target ? 'noopener' : ''}
      >
        {children}
      </a>
    </Link>
  );
};
SimpleLink.propTypes = {
  href: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ pathname: PropTypes.string, query: PropTypes.shape() }),
  ]),
  as: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ pathname: PropTypes.string, query: PropTypes.shape() }),
  ]),
  visible: PropTypes.oneOf(UIKIT_SCREENS),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.string,
  target: PropTypes.string,
  isExternal: PropTypes.bool,
  scroll: PropTypes.bool,
  onClick: PropTypes.func,
  toggle: PropTypes.string,
  shallow: PropTypes.bool,
};
SimpleLink.defaultProps = {
  href: undefined,
  as: undefined,
  className: '',
  visible: undefined,
  target: undefined,
  isExternal: false,
  scroll: true,
  onClick: () => {},
  toggle: undefined,
  shallow: false,
};
export default SimpleLink;
