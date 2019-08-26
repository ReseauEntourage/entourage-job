import React from 'react';
import PropTypes from 'prop-types';

const ScaleCard = ({ title, titleEmphaseStart, description }) => {
  const arr = title.split(' ');
  const title1 = arr.slice(0, titleEmphaseStart).join(' ');
  const title2 = arr.slice(titleEmphaseStart).join(' ');
  return (
    <div className="uk-card uk-height-1-1 uk-card-default uk-card-body">
      <h3>
        <span>{title1} </span>
        <span className="uk-text-primary">{title2}</span>
      </h3>
      <p>{description}</p>
    </div>
  );
};
ScaleCard.propTypes = {
  title: PropTypes.string.isRequired,
  titleEmphaseStart: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};
export default ScaleCard;
