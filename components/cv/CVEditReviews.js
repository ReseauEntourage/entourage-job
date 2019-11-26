/* eslint-disable jsx-a11y/aria-role */
import React from 'react';
import PropTypes from 'prop-types';
import { ReviewCard } from '../cards';
import { Button } from '../utils';
import ModalEdit from '../modals/ModalEdit';
import schemaTestimonial from '../forms/schema/formEditTestimonial';

const CVEditReviews = ({ reviews, onChange }) => {
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
        <ModalEdit
          id="modal-testimonial"
          button="Ajouter une recommandation"
          title="Edition - recommandation"
          formSchema={schemaTestimonial}
          onSubmit={onChange}
        />
      )}
    </>
  );
};
CVEditReviews.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape()),
  onChange: PropTypes.func,
};
CVEditReviews.defaultProps = {
  reviews: [],
  onChange: null,
};
export default CVEditReviews;
