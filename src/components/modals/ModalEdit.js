/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import ModalGeneric from 'src/components/modals/ModalGeneric';
import HeaderModal from 'src/components/modals/HeaderModal';
import FormWithValidation from 'src/components/forms/FormWithValidation';

import { CloseButton } from 'src/components/utils';
import { useResetForm } from 'src/hooks/utils';

const ModalEdit = ({
  title,
  description,
  formSchema,
  defaultValues,
  onSubmit,
  submitText,
}) => {
  const [form, resetForm] = useResetForm();

  return (
    <ModalGeneric resetForm={resetForm}>
      {(closeModal) => {
        return (
          <>
            <CloseButton
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
