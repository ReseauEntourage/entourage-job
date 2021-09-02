import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

import CloseButton from 'src/components/utils/CloseButton';

const Offcanvas = ({ id, children, container, flip, className }) => {
  return (
    <div
      data-uk-offcanvas={`overlay: true; flip: ${flip}; ${
        container ? 'container: true' : ''
      }`}
      id={id}
    >
      <div className={`uk-offcanvas-bar ${className}`}>
        <CloseButton />
        {children}
      </div>
    </div>
  );
};
Offcanvas.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  container: PropTypes.bool,
  flip: PropTypes.bool,
  className: PropTypes.string,
};
Offcanvas.defaultProps = {
  container: undefined,
  flip: true,
  className: '',
};

export const OffcanvasNoSSR = dynamic(
  () => {
    return import('src/components/utils/Offcanvas');
  },
  {
    ssr: false,
  }
);

export default Offcanvas;
