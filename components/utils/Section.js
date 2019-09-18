import React from 'react';
import PropTypes from 'prop-types';
import { UIKIT_STYLES, UIKIT_SECTION_SIZES } from '../variables';

const Section = ({ style, size, id, container, children, className }) => {
  let classBuffer = 'uk-section';
  if (style) classBuffer += ` uk-section-${style}`;
  if (size) classBuffer += ` uk-section-${size}`;
  if (className) classBuffer += ` ${className}`;

  let classBuffer2 = 'uk-container';
  if (container) classBuffer2 += ` uk-container-${container}`;

  return (
    <div className={classBuffer}>
      <div className={classBuffer2} id={id}>
        {children}
      </div>
    </div>
  );
};
Section.propTypes = {
  style: PropTypes.oneOf(UIKIT_STYLES),
  size: PropTypes.oneOf(UIKIT_SECTION_SIZES),
  id: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  container: PropTypes.oneOf(['small', 'large']),
  className: PropTypes.string,
};
Section.defaultProps = {
  style: undefined,
  size: undefined,
  id: undefined,
  container: undefined,
  className: undefined,
};

export default Section;
