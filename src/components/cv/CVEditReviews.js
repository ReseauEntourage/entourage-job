import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'src/components/utils';
import ModalEdit from 'src/components/modals/ModalEdit';
import schemaTestimonial from 'src/components/forms/schema/formEditTestimonial.json';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import ModalConfirm from 'src/components/modals/ModalConfirm';
import { formatParagraph, sortReviews } from 'src/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import { openModal } from 'src/components/modals/Modal';

const CVEditReviews = ({ reviews, onChange }) => {
  const MAX_REVIEWS = 3;

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
              openModal(
                <ModalEdit
                  title="Ajout - Ils me recommandent"
                  formSchema={schemaTestimonial}
                  onSubmit={(fields, closeModal) => {
                    closeModal();
                    onChange({
                      reviews: [...reviews, fields],
                    });
                  }}
                />
              );
            }}
            name="plus"
          />
        )}
      </Grid>
      <ul className="uk-list uk-list-divider">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review, i) => {
            return (
              <li id={i} key={i} className="">
                <Grid
                  eachWidths={['auto', 'expand']}
                  className="uk-padding-small uk-padding-remove-horizontal"
                >
                  <IconNoSSR name="quote-right" />
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
                          openModal(
                            <ModalEdit
                              title="Édition - Ils me recommandent"
                              formSchema={schemaTestimonial}
                              defaultValues={review}
                              onSubmit={(fields, closeModal) => {
                                closeModal();
                                sortedReviews[i] = fields;
                                onChange({ reviews: sortedReviews });
                              }}
                            />
                          );
                        }}
                      />
                      <ButtonIcon
                        name="trash"
                        onClick={() => {
                          openModal(
                            <ModalConfirm
                              text="Êtes-vous sûr(e) de vouloir supprimer cette recommandation ?"
                              buttonText="Supprimer"
                              onConfirm={() => {
                                sortedReviews.splice(i, 1);
                                onChange({ reviews: sortedReviews });
                              }}
                            />
                          );
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
