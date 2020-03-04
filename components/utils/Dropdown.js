import React from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ children, headers, dividers }) => (
  <div className="uk-navbar-dropdown">
    <ul className="uk-nav uk-navbar-dropdown-nav">
      {(Array.isArray(children) ? children : [children]).map((item, key) => {
        const classBuffer = [];
        if (dividers.includes(key)) classBuffer.push('uk-nav-divider');
        if (headers.includes(key)) classBuffer.push('uk-nav-header');
        return (
          <li key={key} className={classBuffer.join(' ')}>
            {item}
          </li>
        );
      })}
    </ul>
  </div>
);

Dropdown.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.element, PropTypes.bool])
  ).isRequired,
  headers: PropTypes.arrayOf(PropTypes.number),
  dividers: PropTypes.arrayOf(PropTypes.number),
};
Dropdown.defaultProps = {
  headers: [],
  dividers: [],
};
export default Dropdown;
