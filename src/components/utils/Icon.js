import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

const Icon = ({ name, ratio, flip, className, id, style }) => {
  return (
    <span
      id={id}
      data-uk-icon={`icon: ${name}; ratio: ${ratio}`}
      className={className}
      style={{ transform: flip ? 'scale(-1, 1)' : undefined, ...style }}
    />
  );
};
Icon.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  ratio: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  flip: PropTypes.bool,
  style: PropTypes.shape(),
};
Icon.defaultProps = {
  className: '',
  ratio: 1,
  flip: false,
  id: undefined,
  style: {},
};

export const IconNoSSR = dynamic(
  () => {
    return import('src/components/utils/Icon');
  },
  { ssr: false }
);

export { Icon as default };
