import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils';

const ReviewCard = ({ author, role, review, picture, colorClass }) => (
  <div className="uk-card uk-card-default uk-card-body uk-margin-medium">
    <div data-uk-grid>
      <div className={`uk-width-auto ${colorClass}`}>
        <IconNoSSR name="quote-right" />
      </div>
      <div className="uk-width-expand">
        <p className="uk-text-small uk-margin-small">{review}</p>
        <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">
          {author}
        </p>
        <p className="uk-margin-remove">{role}</p>
      </div>
      <div
        className="uk-width-auto uk-text-bottom"
        style={{ alignSelf: 'flex-end' }}
      >
        <img
          src={picture}
          alt={author}
          style={{ width: '80px', height: '80px', borderRadius: '50%' }}
        />
      </div>
    </div>
  </div>
);
ReviewCard.defaultProps = {
  author: '',
  colorClass: '',
  picture: '/static/img/arthur.png',
  review: '',
  role: '',
};
ReviewCard.propTypes = {
  author: PropTypes.string.isRequired,
  colorClass: PropTypes.string,
  picture: PropTypes.string.isRequired,
  review: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};
export default ReviewCard;
