import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

const CloseButton = ({ className }) => (
  <button
    className={className || 'uk-offcanvas-close'}
    type="button"
    data-uk-close
    aria-label="close"
  />
);

CloseButton.propTypes = {
  className: PropTypes.string,
};
CloseButton.defaultProps = {
  className: undefined,
};
export const CloseButtonNoSSR = dynamic(() => import('./CloseButton'), {
  ssr: false,
});

export default CloseButton;
