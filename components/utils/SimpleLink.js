import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { UIKIT_SCREENS } from '../variables';

const SimpleLink = ({
  visible,
  href,
  children,
  className,
  target,
  isExternal,
}) => {
  let classBuffer = '';
  if (visible) classBuffer += ` uk-visible@${visible}`;
  if (className) classBuffer += ` ${className}`;

  return isExternal ? (
    <a
      href={href}
      target={target ? '_blank' : ''}
      className={classBuffer}
      rel={target ? 'noopener noreferrer' : ''}
    >
      {children}
    </a>
  ) : (
    <Link href={href}>
      <a
        target={target}
        className={classBuffer}
        rel={target ? 'noopener noreferrer' : ''}
      >
        {children}
      </a>
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
  className: PropTypes.string,
  target: PropTypes.string,
  isExternal: PropTypes.bool,
};
SimpleLink.defaultProps = {
  className: '',
  visible: undefined,
  target: undefined,
  isExternal: false,
};
export default SimpleLink;
