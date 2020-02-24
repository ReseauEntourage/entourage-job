import React from 'react';
import PropTypes from 'prop-types';

const CVBackground = ({ url }) => (
  <div
    style={{
      position: 'relative',
      maxHeight: 'calc(50vw)',
      minHeight: '200px',
      height: '400px',
      width: '100%',
    }}
  >
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        left: 0,
      }}
    >
      <div
        className="uk-background-cover uk-background-top-center"
        style={{
          backgroundImage: `url("${url}")`,
          position: 'absolute',
          display: 'block',
          width: '100%',
          height: '70vw',
          minHeight: '300px',
          maxHeight: 'calc(100vh - 80px)',
        }}
      />
    </div>
  </div>
);
CVBackground.propTypes = {
  url: PropTypes.string,
};
CVBackground.defaultProps = {
  url: '/static/img/arthur-background.jpg',
};

export default CVBackground;
