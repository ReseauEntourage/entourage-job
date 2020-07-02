/* eslint-disable jsx-a11y/aria-role */
/* global UIkit */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconNoSSR, GridNoSSR } from '../utils';
import ModalEdit from '../modals/ModalEdit';
import schemaTestimonial from '../forms/schema/formEditTestimonial';
import ButtonIcon from '../utils/ButtonIcon';
import ModalConfirm from '../modals/ModalConfirm';
import {formatParagraph, sortReviews} from "../../utils";

const CVEditReviews = ({ reviews, onChange }) => {
  const MAX_REVIEWS = 3;
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentDefaultValue, setCurrentDefaultValue] = useState({});

  const sortedReviews = sortReviews(reviews);

  return (
    <div className="uk-card uk-card-default uk-card-body">
      <GridNoSSR gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          Mes <span className="uk-text-primary">recommandations</span>
        </h3>
        {sortedReviews.length < MAX_REVIEWS && (
          <ButtonIcon
            onClick={() => {
              UIkit.modal(`#modal-testimonial-add`).show();
            }}
            name="plus"
          />
        )}
      </GridNoSSR>
      {/* todo terminer linterface graphique. alignement des informaiton */}
      <ul className="uk-list uk-list-divider">
        {/* Il y avait un probleme lors de lapparition de la liste */}
        {/* NotFoundError: Failed to execute 'insertBefore' on 'Node':
        The node before which the new node is to be inserted is not a child of this node. */}
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review, i) => (
            <li id={i} key={i}>
              <GridNoSSR eachWidths={['auto', 'expand']}>
                <IconNoSSR name="quote-right" />
                <>
                  <p className="uk-text-small uk-margin-small">{formatParagraph(review.text)}</p>
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
              </GridNoSSR>
            </li>
          ))
        ) : (
          <li className="uk-text-italic">
            Aucune recommandation n&apos;a encore été ajoutée
          </li>
        )}
      </ul>
      <ModalEdit
        id="modal-testimonial-add"
        title="Ajout - Mes recommandations"
        formSchema={schemaTestimonial}
        onSubmit={(fields, closeModal) => {
          closeModal();
          onChange({
            reviews: [...reviews, fields],
          })
        }}
      />
      <ModalEdit
        id="modal-testimonial-edit"
        title="Édition - Mes recommandations"
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
