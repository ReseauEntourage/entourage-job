import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

import { CloseButtonNoSSR } from './CloseButton';

export const OffcanvasNoSSR = dynamic(import('./Offcanvas'), { ssr: false });

const Offcanvas = ({ id, children }) => (
  <div data-uk-offcanvas="mode: push; overlay: true" id={id}>
    <div className="uk-offcanvas-bar">
      <CloseButtonNoSSR />
      {children}
    </div>
  </div>
);
Offcanvas.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
export default Offcanvas;
