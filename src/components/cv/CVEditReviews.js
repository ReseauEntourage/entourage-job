/* global UIkit */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Grid } from 'src/components/utils';
import ModalEdit from 'src/components/modals/ModalEdit';
import schemaTestimonial from 'src/components/forms/schema/formEditTestimonial.json';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import ModalConfirm from 'src/components/modals/ModalConfirm';
import { formatParagraph, sortReviews } from 'src/utils';

const CVEditReviews = ({ reviews, onChange }) => {
  const MAX_REVIEWS = 3;
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentDefaultValue, setCurrentDefaultValue] = useState({});

  const sortedReviews = sortReviews(reviews);

  return (
    <div className="uk-card uk-card-default uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          Ils me <span className="uk-text-primary">recommandent</span>
        </h3>
        {sortedReviews.length < MAX_REVIEWS && (
          <ButtonIcon
            onClick={() => {
              UIkit.modal(`#modal-testimonial-add`).show();
            }}
            name="plus"
          />
        )}
      </Grid>
      {/* todo terminer linterface graphique. alignement des informaiton */}
      <ul className="uk-list uk-list-divider">
        {/* Il y avait un probleme lors de lapparition de la liste */}
        {/* NotFoundError: Failed to execute 'insertBefore' on 'Node':
        The node before which the new node is to be inserted is not a child of this node. */}
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review, i) => {
            return (
              <li id={i} key={i} className="">
                <Grid
                  eachWidths={['auto', 'expand']}
                  className="uk-padding-small uk-padding-remove-horizontal"
                >
                  <Icon name="quote-right" />
                  <>
                    <p className="uk-text-small uk-margin-small">
                      {formatParagraph(review.text)}
                    </p>
                    <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">
                      {review.name}
                    </p>
                    <p className="uk-margin-remove">{review.status}</p>
                  </>
                  <span className="uk-text-muted uk-margin-small">
                    <div className="uk-flex uk-flex-column">
                      <ButtonIcon
                        name="pencil"
                        onClick={() => {
                          setCurrentIndex(i);
                          setCurrentDefaultValue(review);
                          UIkit.modal(`#modal-testimonial-edit`).show();
                        }}
                      />
                      <ButtonIcon
                        name="trash"
                        onClick={() => {
                          setCurrentIndex(i);
                          UIkit.modal(`#modal-testimonial-remove`).show();
                        }}
                      />
                    </div>
                  </span>
                </Grid>
              </li>
            );
          })
        ) : (
          <li className="uk-text-italic">
            Aucune recommandation n&apos;a encore été ajoutée
          </li>
        )}
      </ul>
      <ModalEdit
        id="modal-testimonial-add"
        title="Ajout - Ils me recommandent"
        formSchema={schemaTestimonial}
        onSubmit={(fields, closeModal) => {
          closeModal();
          onChange({
            reviews: [...reviews, fields],
          });
        }}
      />
      <ModalEdit
        id="modal-testimonial-edit"
        title="Édition - Ils me recommandent"
        formSchema={schemaTestimonial}
        defaultValues={currentDefaultValue}
        onSubmit={(fields, closeModal) => {
          closeModal();
          sortedReviews[currentIndex] = fields;
          onChange({ reviews: sortedReviews });
        }}
      />
      <ModalConfirm
        id="modal-testimonial-remove"
        text="Êtes-vous sûr(e) de vouloir supprimer cette recommandation ?"
        buttonText="Supprimer"
        onConfirm={() => {
          sortedReviews.splice(currentIndex, 1);
          onChange({ reviews: sortedReviews });
        }}
      />
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
