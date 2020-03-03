import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

export const IconNoSSR = dynamic(() => import('./Icon'), {
  ssr: false,
});

const Icon = ({ name, ratio, flip, className }) => (
  <span
    data-uk-icon={`icon: ${name}; ratio: ${ratio}`}
    className={className}
    style={{ transform: flip ? 'scale(-1, 1)' : undefined }}
  />
);
Icon.propTypes = {
  name: PropTypes.string.isRequired,
  ratio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  flip: PropTypes.bool,
};
Icon.defaultProps = {
  className: '',
  ratio: 1,
  flip: false,
};

export { Icon as default };
