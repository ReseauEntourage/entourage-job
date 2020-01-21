import React from 'react';
import PropTypes from 'prop-types';

const CVEditPicture = ({ img }) => (
  <div
    className="uk-card uk-card-default uk-card-body uk-height-1-1 uk-background-cover"
    style={{ backgroundImage: `url(${img})`, minHeight: '300px' }}
  />
);
CVEditPicture.propTypes = {
  img: PropTypes.string,
};
CVEditPicture.defaultProps = {
  img: '../../static/img/arthur-background.jpg',
};
export default CVEditPicture;
