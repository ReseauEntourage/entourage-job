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
            onSubmit(fields, closeModal);
          }}
        />
      </>
    )}
  </ModalGeneric>
);
ModalEdit.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  formSchema: PropTypes.shape({
    id: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.object),
    rules: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.objectOf(PropTypes.any),
  description: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  submitText: PropTypes.string,
};
ModalEdit.defaultProps = {
  defaultValues: {},
  description: undefined,
  submitText: 'Sauvegarder',
};

export default ModalEdit;
