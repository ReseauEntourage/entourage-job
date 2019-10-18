import React from 'react';
import PropTypes from 'prop-types';

const StepCard = ({ numStep, img, description }) => (
  <div className="uk-card">
    <div className="uk-card-media-top uk-text-center">
      <img src={img} alt={`Etape ${numStep}`} />
    </div>
    <div className="uk-card-body">
      <div className="uk-flex">
        <div className="uk-width-1-6 uk-text-center">
          <h2 className="uk-h2 uk-text-primary uk-text-bold">{numStep}</h2>
        </div>
        <div className="uk-width-5-6">{description}</div>
      </div>
    </div>
  </div>
);

StepCard.propTypes = {
  numStep: PropTypes.number.isRequired,
  img: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default StepCard;
