import React from 'react';
import PropTypes from 'prop-types';

const Padding = ({ size, center, children }) => {
  let classBuffer = 'uk-padding';
  if (center) classBuffer += ' uk-flex uk-flex-center';
  if (size) classBuffer += ` uk-padding-${size}`;
  return <div className={classBuffer}>{children}</div>;
};
Padding.propTypes = {
  center: PropTypes.bool,
  size: PropTypes.string,
  children: PropTypes.element.isRequired,
};
Padding.defaultProps = {
  center: false,
  size: undefined,
};
export default Padding;
