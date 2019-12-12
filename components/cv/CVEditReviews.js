/* eslint-disable jsx-a11y/aria-role */
import React from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR } from '../utils';
import ModalEdit from '../modals/ModalEdit';
import schemaTestimonial from '../forms/schema/formEditTestimonial';

const MAX_REVIEWS = 4;
const CVEditReviews = ({ reviews, onChange }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <div className="uk-flex-inline uk-width-1-1">
        <h3 className="uk-card-title">
          Mes <span className="uk-text-primary">recommandations</span>
        </h3>
        {onChange && reviews.length < MAX_REVIEWS && (
          <h3 className="uk-card-title uk-align-right uk-text-right uk-width-expand">
            <ModalEdit
              id="modal-testimonial-add"
              button="plus"
              title="Ajout - Mes recommandations"
              formSchema={schemaTestimonial}
              onSubmit={(fields) =>
                onChange({
                  reviews: [...reviews, fields],
                })
              }
            />
          </h3>
        )}
      </div>
      {/* todo terminer linterface graphique. alignement des informaiton */}
      {reviews.length > 0 ? (
        <ul className="uk-list uk-list-divider">
          {reviews.map((review, i) => (
            <li id={i} key={i}>
              <div className="uk-child-width-auto" data-uk-grid>
                <div>
                  <IconNoSSR name="quote-right" />
                </div>
                <div className="uk-width-expand">
                  <p className="uk-text-small uk-margin-small">{review.text}</p>
                  <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">
                    {review.name}
                  </p>
                  <p className="uk-margin-remove">{review.status}</p>
                </div>
                <div>
                  <span className="uk-text-muted uk-margin-small">
                    <ModalEdit
                      // must use different id for each modal
                      id={`modal-testimonial-edit-${i}`}
                      title="Édition - Mes recommandations"
                      formSchema={schemaTestimonial}
                      defaultValues={review}
                      onSubmit={(fields) => {
                        const newReviews = reviews;
                        newReviews[i] = fields;
                        onChange({ reviews: newReviews });
                      }}
                    />
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="uk-text-italic">
          Aucune recommandation n&apos;a encore été ajoutée
        </p>
      )}
    </div>
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
