import React from 'react';
import PropTypes from 'prop-types';
import { UIKIT_SECTION_SIZES, UIKIT_STYLES } from 'src/components/variables';

const Section = ({
  style,
  size,
  id,
  container,
  children,
  className,
  preserveColor,
}) => {
  let classBuffer = 'uk-section';
  if (style) classBuffer += ` uk-section-${style}`;
  if (size) classBuffer += ` uk-section-${size}`;
  if (className) classBuffer += ` ${className}`;
  if (preserveColor) classBuffer += ` uk-preserve-color`;

  let classBuffer2 = 'uk-container';
  if (container) classBuffer2 += ` uk-container-${container}`;

  return (
    <div className={classBuffer} id={id}>
      <div className={classBuffer2}>{children}</div>
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
  preserveColor: PropTypes.bool,
};
Section.defaultProps = {
  style: undefined,
  size: undefined,
  id: undefined,
  container: undefined,
  className: undefined,
  preserveColor: false,
};

export default Section;
