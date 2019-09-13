import React from 'react';
import PropTypes from 'prop-types';

const StoryProfileCard = ({ description }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">
        Mon <span className="uk-text-primary">histoire</span>
      </h3>
      <p>{description}</p>
    </div>
  );
};
StoryProfileCard.propTypes = {
  description: PropTypes.string.isRequired,
};
export default StoryProfileCard;
