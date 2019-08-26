import React from 'react';
import PropTypes from 'prop-types';
import { UIKIT_STYLES, UIKIT_SECTION_SIZES } from '../variables';

const Section = ({ style, size, id, containerLarge, children }) => {
  let classBuffer = 'uk-section';
  if (style) classBuffer += ` uk-section-${style}`;
  if (size) classBuffer += ` uk-section-${size}`;

  let classBuffer2 = 'uk-container';
  if (containerLarge) classBuffer2 += ` uk-container-large`;

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
  containerLarge: PropTypes.bool,
};
Section.defaultProps = {
  style: undefined,
  size: undefined,
  id: undefined,
  containerLarge: false,
};

export default Section;
