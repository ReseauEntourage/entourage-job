import React from 'react';
import PropTypes from 'prop-types';

const CVEditPicture = ({ img }) => {
  const imgToDisplay =
    img !== '' ? img : '../../static/img/arthur-background.jpg';
  return (
    <div
      className="uk-card uk-card-default uk-card-body uk-height-medium uk-background-cover"
      style={{ backgroundImage: `url(${imgToDisplay})` }}
    />
  );
};
CVEditPicture.propTypes = {
  img: PropTypes.string.isRequired,
};
export default CVEditPicture;
