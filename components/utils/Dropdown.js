import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

export const DropdownNoSSR = dynamic(() => import('./Dropdown'), {
  ssr: false,
});

const Dropdown = ({ children, headers, dividers, active }) => (
  <div
    style={{ minWidth: '10px' }}
    data-uk-dropdown="mode: click; pos: bottom-justify; boundary: #untruc; boundary-align: true"
  >
    <ul className="uk-nav uk-navbar-dropdown-nav">
      {(Array.isArray(children) ? children : [children]).map((item, key) => {
        const classBuffer = [];
        if (active === key) classBuffer.push('uk-active');
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
  active: PropTypes.number,
};
Dropdown.defaultProps = {
  headers: [],
  dividers: [],
  active: undefined,
};
export default Dropdown;
