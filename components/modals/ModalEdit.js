/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import ModalGeneric from './ModalGeneric';
import HeaderModal from './HeaderModal';
import FormWithValidation from '../forms/FormWithValidation';

import { CloseButtonNoSSR } from '../utils';
import { useResetForm } from '../../hooks/utils';

const ModalEdit = ({
  id,
  title,
  description,
  formSchema,
  defaultValues,
  onSubmit,
  submitText,
}) => {
  const [form, resetForm] = useResetForm();

  return (
    <ModalGeneric id={id} resetForm={resetForm}>
      {(closeModal) => {
        return (
          <>
            <CloseButtonNoSSR
              className="uk-modal-close-default"
              onClick={resetForm}
            />
            <HeaderModal>{title}</HeaderModal>
            {description ? <p className="uk-text-lead">{description}</p> : null}

            <FormWithValidation
              ref={form}
              submitText={submitText}
              formSchema={formSchema}
              defaultValues={defaultValues}
              onCancel={closeModal}
              onSubmit={(fields, setError) => {
                onSubmit(fields, closeModal, setError);
              }}
            />
          </>
        );
      }}
    </ModalGeneric>
  );
};

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
