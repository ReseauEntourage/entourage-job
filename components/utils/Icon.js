import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

const Icon = ({ name, ratio, flip, className, id }) => (
  <span
    id={id}
    data-uk-icon={`icon: ${name}; ratio: ${ratio}`}
    className={className}
    style={{ transform: flip ? 'scale(-1, 1)' : undefined }}
  />
);
Icon.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  ratio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  flip: PropTypes.bool,
};
Icon.defaultProps = {
  className: '',
  ratio: 1,
  flip: false,
  id: undefined,
};

export const IconNoSSR = dynamic(() => import('./Icon'), { ssr: false });

export { Icon as default };
