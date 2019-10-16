import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

export const IconNoSSR = dynamic(() => import('./Icon'), {
  ssr: false,
});

const Icon = ({ name, ratio, className }) => (
  <span data-uk-icon={`icon: ${name}; ratio: ${ratio}`} className={className} />
);
Icon.propTypes = {
  name: PropTypes.string.isRequired,
  ratio: PropTypes.number,
  className: PropTypes.string
};
Icon.defaultProps = {
  className: "",
  ratio: 1,
};

export { Icon as default };
