import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

const Img = ({ src, alt, width, height, className }) => {
  return (
    <img
      alt={alt}
      data-src={src}
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
};
Img.defaultProps = {
  width: undefined,
  height: undefined,
  className: undefined,
};

export const ImgNoSSR = dynamic(() => import('./Img'), { ssr: false });

export default Img;
