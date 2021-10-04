import React from 'react';
import PropTypes from 'prop-types';
import {
  UIKIT_ALIGNMENT,
  UIKIT_COLORS,
  UIKIT_SCREENS,
  UIKIT_TEXT_TAG,
  UIKIT_TRANSFORM,
} from 'src/components/variables';

const Text = ({
  tag,
  color,
  alignment,
  alignmentResponsive,
  transform,
  children,
}) => {
  let classBuffer = '';
  if (color) {
    classBuffer += ` uk-text-${color}`;
  }
  if (alignment) {
    classBuffer += ` uk-text-${alignment}`;
    if (alignmentResponsive) {
      classBuffer += `@${alignmentResponsive}`;
    }
  }
  if (transform) {
    classBuffer += `uk-text-${transform}`;
  }
  switch (tag) {
    case 'p':
      return <p className={classBuffer}>{children}</p>;
    case 'h1':
      return <h1 className={classBuffer}>{children}</h1>;
    case 'h2':
      return <h2 className={classBuffer}>{children}</h2>;
    case 'h3':
      return <h3 className={classBuffer}>{children}</h3>;
    case 'h4':
      return <h4 className={classBuffer}>{children}</h4>;
    case 'h5':
      return <h5 className={classBuffer}>{children}</h5>;
    default:
      return <span className={classBuffer}>{children}</span>;
  }
};
Text.propTypes = {
  color: PropTypes.oneOf(UIKIT_COLORS),
  alignment: PropTypes.oneOf(UIKIT_ALIGNMENT),
  alignmentResponsive: PropTypes.oneOf(UIKIT_SCREENS),
  transform: PropTypes.oneOf(UIKIT_TRANSFORM),
  tag: PropTypes.oneOf(UIKIT_TEXT_TAG).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};
Text.defaultProps = {
  color: undefined,
  alignment: undefined,
  transform: undefined,
  alignmentResponsive: undefined,
};

export { Text as default };
