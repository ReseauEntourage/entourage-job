import React from 'react';
import PropTypes from 'prop-types';
import { UIKIT_STYLES, UIKIT_BLENDS } from '../variables';

const Background = ({ src, position, blend, fixed, children }) => {
  let classBuffer = 'uk-background-cover';
  if (position) classBuffer += ` uk-background-${position}`;
  if (blend.mode) classBuffer += ` uk-background-blend-${blend.mode}`;
  if (fixed) classBuffer += ` uk-background-fixed`;
  const styleBuffer = {
    backgroundImage: `url(${src})`,
  };
  if (blend.color) {
    classBuffer += ` uk-background-${blend.color}`;
  } else if (blend.colorHex) {
    styleBuffer.backgroundColor = blend.colorHex ? blend.colorHex : undefined;
  }
  return (
    <div className={classBuffer} style={styleBuffer}>
      {children}
    </div>
  );
};
Background.propTypes = {
  position: PropTypes.string,
  src: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  blend: PropTypes.shape({
    color: PropTypes.oneOf(UIKIT_STYLES),
    colorHex: PropTypes.string,
    mode: PropTypes.oneOf(UIKIT_BLENDS),
  }),
  fixed: PropTypes.bool,
};
Background.defaultProps = {
  position: undefined,
  blend: {},
  fixed: false,
};

export default Background;
