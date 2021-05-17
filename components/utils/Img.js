import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { addPrefix } from '../../utils';

const Img = ({ src, alt, width, height, className, cover }) => {
  if (cover) {
    return (
      <img
        alt={alt}
        data-src={addPrefix(src)}
        width={width}
        height={height}
        data-uk-img=""
        className={className}
        data-uk-cover
      />
    );
  }
  return (
    <img
      alt={alt}
      data-src={addPrefix(src)}
      width={width}
      height={height}
      data-uk-img=""
      className={className}
    />
  );
};

Img.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  cover: PropTypes.bool,
};
Img.defaultProps = {
  width: undefined,
  height: undefined,
  className: undefined,
  cover: false,
};

export const ImgNoSSR = dynamic(
  () => {
    return import('./Img');
  },
  { ssr: false }
);

export default Img;
