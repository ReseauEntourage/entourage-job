import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { UIKIT_SCREENS } from '../variables';

const SimpleLink = ({ visible, href, children, className, target }) => {
  let classBuffer = '';
  if (visible) classBuffer += ` uk-visible@${visible}`;
  if (className) classBuffer += ` ${className}`;
  return (
    <Link href={href}>
      <a target={target} className={classBuffer}>
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
  target: PropTypes.string,
};
SimpleLink.defaultProps = { visible: undefined, target: undefined };
export default SimpleLink;
