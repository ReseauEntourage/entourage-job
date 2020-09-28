import React from 'react'
import PropTypes from 'prop-types';

const ImgProfile = ({ src, alt, width, height, border }) => (
  <div className={("uk-cover-container uk-border-") + border}
    style={{ "width": width, "height": height }}>
    <img data-uk-cover
      src={src}
      alt={alt}
    />
  </div>
);
ImgProfile.defaultProps = {
  src: "/static/img/arthur.png",
  alt: "",
  width: "80px",
  height: "80px",
  border: "circle",
};
ImgProfile.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  border: PropTypes.oneOf(["circle", "pill", "rounded"]),
};
export default ImgProfile;
