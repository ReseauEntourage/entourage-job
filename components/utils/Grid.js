import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

export const GridNoSSR = dynamic(() => import('./Grid'), { ssr: false });

const Grid = ({ items, childWidths, match, divider, center, parallax, className }) => {
  let classBuffer = '';
  let gridBuffer = '';
  if (parallax) gridBuffer += `parallax: ${parallax}`;
  classBuffer += childWidths
    .map((childWidth) => ` uk-child-width-${childWidth}`)
    .join(' ');
  if (match) classBuffer += ' uk-grid-match';
  if (divider) classBuffer += ' uk-grid-divider';
  if (center) classBuffer += ' uk-flex-center';
  if (className) classBuffer += ` ${className}`;

  return (
    <div className={classBuffer} data-uk-grid={gridBuffer}>
      {items.map((item, index) => (
        <div key={index}>{item}</div>
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
export default Grid;
