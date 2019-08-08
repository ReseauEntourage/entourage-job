import React from 'react';
import PropTypes from 'prop-types';
import { UIKIT_STYLES, UIKIT_SECTION_SIZES } from '../variables';

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
