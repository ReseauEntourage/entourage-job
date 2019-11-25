import React from 'react';
import PropTypes from 'prop-types';

const StoryProfileCard = ({ description }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <h3 className="uk-card-title">
        Mon <span className="uk-text-primary">histoire</span>
      </h3>
      {description ? (
        <p>{description}</p>
      ) : (
        <p className="uk-text-italic">
          Aucune histoire n&apos;a encore été ajoutée
        </p>
      )}
    </div>
  );
};
StoryProfileCard.propTypes = {
  description: PropTypes.string,
};
StoryProfileCard.defaultProps = {
  description: '',
};
export default StoryProfileCard;
