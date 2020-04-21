import React from 'react';
import PropTypes from 'prop-types';

const SituationCard = ({ imgSrc, isLeft, children }) => (
  <div className="uk-card uk-card-large uk-card-default uk-card-body">
    <div className="uk-panel uk-flex uk-flex-middle" data-uk-grid>
      <div className="uk-width-auto@s uk-width-1-1 uk-text-center">
        <img
          src={imgSrc}
          style={{ width: '150px', height: '150px' }}
          alt="1"
          className={`uk-margin-remove-bottom ${
            isLeft ? 'uk-margin-small-right' : 'uk-margin-small-left'
          }`}
        />
      </div>
      <div
        className={`uk-text-center uk-text-left@m ${
          isLeft
            ? 'uk-width-1-1 uk-width-expand@s '
            : 'uk-width-expand uk-flex-first@s'
        }`}
      >
        {children}
      </div>
    </div>
  </div>
);
SituationCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  isLeft: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};
SituationCard.defaultProps = {
  isLeft: false,
};
export default SituationCard;
