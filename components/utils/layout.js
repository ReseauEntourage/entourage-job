import React from 'react';
import PropTypes from 'prop-types';

export const Grid = ({ items, size, match }) => {
  let classBuffer = `uk-child-width-1-${size}`;
  if (match) {
    classBuffer += ' uk-grid-match';
  }
  return (
    <div className={classBuffer} data-uk-grid>
      {items.map((item) => (
        <div>{item}</div>
      ))}
    </div>
  );
};
Grid.propTypes = {
  match: PropTypes.bool,
  size: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(PropTypes.element).isRequired,
};
Grid.defaultProps = {
  match: false,
};

export const Section = ({ children }) => {
  return (
    <div className="uk-section">
      <div className="uk-container">{children}</div>
    </div>
  );
};
Section.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};
