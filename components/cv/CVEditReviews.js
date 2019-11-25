/* eslint-disable jsx-a11y/aria-role */
import React from 'react';
import PropTypes from 'prop-types';
import { ReviewCard } from '../cards';
import { Button } from '../utils';

const CVEditReviews = ({ reviews }) => {
  return (
    <>
      {reviews.length === 0 &&
        reviews.map((review, i) => (
          <ReviewCard
            picture="/static/img/arthur.png"
            review="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum sed diam eu pulvinar."
            author="Hervé"
            role="Assistant social"
            key={i}
          />
        ))}
      {reviews.length < 3 && (
        <Button style="primary">Ajouter une recommandation</Button>
      )}
    </>
  );
};
CVEditReviews.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape()),
};
CVEditReviews.defaultProps = {
  reviews: [],
};
export default CVEditReviews;
