import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR, GridNoSSR } from '../utils';
import ImgProfile from '../utils/ImgProfile';

const ReviewCard = ({ author, role, review, picture, colorClass }) => (
  <div className="uk-card uk-card-default uk-card-body">
    <GridNoSSR between eachWidths={['auto', 'expand', '1-4']}>
      <IconNoSSR name="quote-right" className={`${colorClass}`} />
      <>
        <p className="uk-text-small uk-margin-small">{review}</p>
        <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">
          {author}
        </p>
        <p className="uk-margin-remove">{role}</p>
      </>
      <div className="uk-text-bottom" style={{ alignSelf: 'flex-end' }}>
        <ImgProfile
          src={picture}
          alt={author}
          width="80px"
          height="80px"
          border="circle"
        />
      </div>
    </GridNoSSR>
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
