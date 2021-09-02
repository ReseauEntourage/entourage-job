import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

const Grid = ({
  items,
  childWidths,
  match,
  divider,
  center,
  between,
  around,
  parallax,
  className,
  eachWidths,
  gap,
  children,
  top,
  middle,
  bottom,
  column,
  row,
  masonry,
  style,
  reverse,
}) => {
  let classBuffer = '';
  let gridBuffer = '';
  if (parallax) gridBuffer += `parallax: ${parallax};`;
  if (masonry) gridBuffer += 'masonry: true';
  classBuffer += childWidths
    .map((childWidth) => {
      return ` uk-child-width-${childWidth}`;
    })
    .join(' ');
  if (gap) classBuffer += ` uk-grid-${gap}`;
  if (match) classBuffer += ' uk-grid-match';
  if (divider) classBuffer += ' uk-grid-divider';
  if (center) classBuffer += ' uk-flex-center';
  if (between) classBuffer += ' uk-flex-between';
  if (around) classBuffer += ' uk-flex-around';
  if (top) classBuffer += ' uk-flex-top';
  if (middle) classBuffer += ' uk-flex-middle';
  if (bottom) classBuffer += ' uk-flex-bottom';
  if (column) classBuffer += ' uk-flex-column';
  if (row) classBuffer += ' uk-flex-row';
  if (reverse) classBuffer += ' uk-flex-row-reverse';

  if (className) classBuffer += ` ${className}`;
  const content = (() => {
    if (items !== undefined) {
      return items;
    }
    if (Array.isArray(children)) {
      return children;
    }
    return [children];
  })();
  // on filtre les elemnt vide
  return (
    <div className={classBuffer} data-uk-grid={gridBuffer} style={style}>
      {content
        .filter((_) => {
          return _;
        })
        .map((item, index) => {
          return (
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
          );
        })}
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
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.element, PropTypes.bool])
  ),
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.bool])
    ),
  ]),
  className: PropTypes.string,
  around: PropTypes.bool,
  top: PropTypes.bool,
  middle: PropTypes.bool,
  bottom: PropTypes.bool,
  column: PropTypes.bool,
  row: PropTypes.bool,
  masonry: PropTypes.bool,
  style: PropTypes.shape(),
  reverse: PropTypes.bool,
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
  className: undefined,
  around: false,
  top: false,
  middle: false,
  bottom: false,
  column: false,
  row: false,
  masonry: false,
  style: undefined,
  reverse: false,
};

export const GridNoSSR = dynamic(
  () => {
    return import('src/components/utils/Grid');
  },
  { ssr: false }
);

export default Grid;
