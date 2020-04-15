import React from 'react';
import PropTypes from 'prop-types';

const CVBackground = ({ url }) => (
  <div
    style={{
      position: 'relative',
      minHeight: '220px',
      maxHeight: '410px',
      height: '50vw',
      width: '100%',
    }}
  >
    <div
      className="uk-background-cover uk-background-center"
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
        maxHeight: '170%',
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
