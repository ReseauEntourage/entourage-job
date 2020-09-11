/* eslint-disable no-undef */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { CloseButtonNoSSR } from '../utils';
import { useResetForm } from "../../hooks";
import { ModalContext } from '../store/ModalProvider';
import FormWithValidation from '../forms/FormWithValidation';
import ModalGeneric from './ModalGeneric';
import HeaderModal from './HeaderModal';

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
  const { setClose } = useContext(ModalContext);

  return (
    <ModalGeneric id={id} resetForm={resetForm}>
      <>
        <CloseButtonNoSSR className="uk-modal-close-default" onClick={resetForm} />
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
          ref={form}
          submitText={submitText}
          formSchema={formSchema}
          defaultValues={defaultValues}
          onCancel={() => setClose(true)}
          onSubmit={(fields, setError) => {
            onSubmit(fields, () => setClose(true), setError);
          }}
        />
      </>
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
