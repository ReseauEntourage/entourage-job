import React from 'react';
import PropTypes from 'prop-types';
import {IconNoSSR, GridNoSSR, ImgNoSSR} from '../utils';

const ReviewCard = ({ author, role, review }) => (
  <div className="uk-card uk-card-default uk-card-body uk-background-muted uk-flex">
    <GridNoSSR column between eachWidths={['expand', 'auto']}>
      <>
        <ImgNoSSR alt="" width="27" height="21" src="static/img/guillemets.png"  />
        <p className="uk-text-small uk-margin-small">{review}</p>
        <div className="uk-text-bottom" style={{display: 'flex', justifyContent: 'flex-end' }}>
          <ImgNoSSR alt="" width="15" height="12" src="static/img/guillemetsPetits.png"  />
        </div>
      </>
      <>
        <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">
          {author}
        </p>
        <p className="uk-margin-remove">{role}</p>
      </>
    </GridNoSSR>
  </div>
);

ReviewCard.defaultProps = {
};

ReviewCard.propTypes = {
  author: PropTypes.string.isRequired,
  review: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};
export default ReviewCard;
