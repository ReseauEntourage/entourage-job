import React from 'react';
import PropTypes from 'prop-types';

const CVBackground = ({ url }) => (
  <div
    className="uk-container"
    data-uk-parallax="y: 0, -130"
    style={{
      position: 'relative',
      minHeight: '220px',
      maxHeight: '50vh',
      height: '50vw',
    }}
  >
    <div
      className="uk-background-cover uk-background-center uk-box-shadow-small"
      style={{
        backgroundImage: `url("${url}")`,
        backgroundPosition: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
        left: 0,
        display: 'block',
        width: '100%',
        minHeight: '140%',
        maxHeight: '140%',
        height: '70vw',
      }}
    />
  </div>
);
CVBackground.propTypes = {
  url: PropTypes.string,
};
CVBackground.defaultProps = {
  url: '/static/img/arthur-background.jpg',
};

export default CVBackground;
