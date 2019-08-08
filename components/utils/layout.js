import React from 'react';
import PropTypes from 'prop-types';
import { UIKIT_STYLES, UIKIT_SECTION_SIZES, UIKIT_BLENDS } from '../variables';

export const Grid = ({ items, childWidths, match, center, parallax }) => {
  let classBuffer = '';
  let gridBuffer = '';
  if (parallax) gridBuffer += `parallax: ${parallax}`;
  classBuffer += childWidths
    .map((childWidth) => ` uk-child-width-${childWidth}`)
    .join(' ');
  if (match) classBuffer += ' uk-grid-match';
  if (center) classBuffer += ' uk-flex-center';
  return (
    <div className={classBuffer} data-uk-grid={gridBuffer}>
      {items.map((item) => (
        <div>{item}</div>
      ))}
    </div>
  );
};
Grid.propTypes = {
  parallax: PropTypes.number,
  match: PropTypes.bool,
  center: PropTypes.bool,
  childWidths: PropTypes.arrayOf(PropTypes.string).isRequired,
  items: PropTypes.arrayOf(PropTypes.element).isRequired,
};
Grid.defaultProps = {
  match: false,
  center: false,
  parallax: undefined,
};

export const Background = ({ src, position, blend, children }) => {
  let classBuffer = 'uk-background-cover';
  if (position) classBuffer += ` uk-background-${position}`;
  if (blend.mode) classBuffer += ` uk-background-blend-${blend.mode}`;
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
    mode: PropTypes.oneOf(UIKIT_BLENDS).isRequired,
  }),
};
Background.defaultProps = {
  position: undefined,
  blend: {},
};
export const Section = ({ style, size, id, children }) => {
  let classBuffer = 'uk-section';
  if (style) classBuffer += ` uk-section-${style}`;
  if (size) classBuffer += ` uk-section-${size}`;
  return (
    <div className={classBuffer} id={id}>
      <div className="uk-container">{children}</div>
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
};

Section.defaultProps = {
  style: undefined,
  size: undefined,
  id: undefined,
};
