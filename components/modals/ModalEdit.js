/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import ModalGeneric from './ModalGeneric';
import HeaderModal from './HeaderModal';
import FormWithValidation from '../forms/FormWithValidation';

import { CloseButtonNoSSR } from '../utils';

const ModalEdit = ({
  id,
  title,
  description,
  formSchema,
  defaultValues,
  onSubmit,
  submitText,
}) => (
  <ModalGeneric id={id}>
    {(closeModal) => (
      <>
        <CloseButtonNoSSR className="uk-modal-close-default" />
        <HeaderModal>{title}</HeaderModal>
        {description ? (
          <p
            className="uk-text-lead"
            style={{
              lineHeight: '1.2',
              fontSize: '1.2rem',
              fontWeight: '500',
            }}
          >
            {description}
          </p>
        ) : null}

        <FormWithValidation
          submitText={submitText}
          formSchema={formSchema}
          defaultValues={defaultValues}
          onCancel={closeModal}
          onSubmit={(fields) => {
            closeModal(); // TODO revoir le fonctionnement. si on fait une requete ferme la modal mais process toujours la reponse server
            onSubmit(fields);
          }}
        />
      </>
    )}
  </ModalGeneric>
);
ModalEdit.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.element.isRequired,
  formSchema: PropTypes.shape({
    id: PropTypes.string,
    fields: PropTypes.object,
    rules: PropTypes.object,
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.string,
  submitText: PropTypes.string,
};
ModalEdit.defaultProps = {
  defaultValues: [],
  description: undefined,
  submitText: 'Sauvegarder',
};

export default ModalEdit;
