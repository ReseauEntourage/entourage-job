import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

export const GridNoSSR = dynamic(() => import('./Grid'), { ssr: false });

const Grid = ({
  items,
  childWidths,
  match,
  divider,
  center,
  between,
  parallax,
  className,
  eachWidths,
  gap,
  children,
}) => {
  let classBuffer = '';
  let gridBuffer = '';
  if (parallax) gridBuffer += `parallax: ${parallax}`;
  classBuffer += childWidths
    .map((childWidth) => ` uk-child-width-${childWidth}`)
    .join(' ');
  if (gap) classBuffer += ` uk-grid-${gap}`;
  if (match) classBuffer += ' uk-grid-match';
  if (divider) classBuffer += ' uk-grid-divider';
  if (center) classBuffer += ' uk-flex-center';
  if (between) classBuffer += ' uk-flex-between';
  if (className) classBuffer += ` ${className}`;
  return (
    <div className={classBuffer} data-uk-grid={gridBuffer}>
      {(items !== undefined ? items : children).map((item, index) => (
        <div
          // todo optimize
          className={
            index < eachWidths.length
              ? `uk-width-${eachWidths[index]}`
              : undefined
          }
          key={index}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
Grid.propTypes = {
  parallax: PropTypes.number,
  match: PropTypes.bool,
  center: PropTypes.bool,
  between: PropTypes.bool,
  childWidths: PropTypes.arrayOf(PropTypes.string),
  divider: PropTypes.bool,
  eachWidths: PropTypes.arrayOf(PropTypes.string),
  gap: PropTypes.oneOf(['small', 'medium', 'large', 'collapse']),
  items: PropTypes.arrayOf(PropTypes.element),
  children: PropTypes.arrayOf(PropTypes.element),
};
Grid.defaultProps = {
  match: false,
  center: false,
  between: false,
  divider: false,
  parallax: undefined,
  childWidths: [],
  eachWidths: [],
  gap: undefined,
  items: undefined,
  children: [],
};
export default Grid;
