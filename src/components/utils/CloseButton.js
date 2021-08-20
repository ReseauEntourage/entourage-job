import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

const CloseButton = ({ className, onClick }) => {
  return (
    <button
      className={className || 'uk-offcanvas-close'}
      type="button"
      data-uk-close
      aria-label="close"
      onClick={onClick}
    />
  );
};

CloseButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};
CloseButton.defaultProps = {
  className: undefined,
  onClick: () => {},
};
export const CloseButtonNoSSR = dynamic(
  () => {
    return import('src/components/utils/CloseButton');
  },
  {
    ssr: false,
  }
);

export default CloseButton;
