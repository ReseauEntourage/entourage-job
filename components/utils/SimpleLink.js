import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { UIKIT_SCREENS } from '../variables';

const SimpleLink = ({ visible, href, children, className }) => {
  let classBuffer = '';
  if (visible) classBuffer += ` uk-visible@${visible}`;
  if (className) classBuffer += ` ${className}`;
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
export default SimpleLink;
