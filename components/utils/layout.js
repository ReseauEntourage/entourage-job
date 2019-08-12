import React from 'react';
import PropTypes from 'prop-types';
import { UIKIT_STYLES, UIKIT_SECTION_SIZES, UIKIT_BLENDS } from '../variables';

export const Grid = ({
  items,
  childWidths,
  match,
  divider,
  center,
  parallax,
}) => {
  let classBuffer = '';
  let gridBuffer = '';
  if (parallax) gridBuffer += `parallax: ${parallax}`;
  classBuffer += childWidths
    .map((childWidth) => ` uk-child-width-${childWidth}`)
    .join(' ');
  if (match) classBuffer += ' uk-grid-match';
  if (divider) classBuffer += ' uk-grid-divider';
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
  childWidths: PropTypes.arrayOf(PropTypes.string),
  items: PropTypes.arrayOf(PropTypes.element).isRequired,
  divider: PropTypes.bool,
};
Grid.defaultProps = {
  match: false,
  center: false,
  divider: false,
  parallax: undefined,
  childWidths: [],
};

export const Background = ({ src, position, blend, fixed, children }) => {
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

export const Section = ({ style, size, id, containerLarge, children }) => {
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

export const Padding = ({ size, center, children }) => {
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
