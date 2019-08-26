import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

export const IconNoSSR = dynamic(() => import('./Icon'), {
  ssr: false,
});

const Icon = ({ name, ratio }) => (
  <span data-uk-icon={`icon: ${name}; ratio: ${ratio}`} />
);
Icon.propTypes = {
  name: PropTypes.string.isRequired,
  ratio: PropTypes.number,
};
Icon.defaultProps = {
  ratio: 1,
};

export { Icon as default };
