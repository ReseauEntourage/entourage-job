/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import ModalGeneric from '../ModalGeneric';
import HeaderModal from '../HeaderModal';
import FormWithValidation from '../../forms/FormWithValidation';
import schema from '../../forms/schema/formEditCatchphrase';

const ModalCatchphraseCV = ({ defaultValue, setValue }) => {
  schema.fields[0].value = defaultValue;
  return (
    <ModalGeneric id="modalCatchphraseCV">
      {(closeModal) => (
        <>
          <HeaderModal>Edition - phrase d&apos;accroche</HeaderModal>
          <FormWithValidation
            formData={schema}
            onCancel={closeModal}
            onSubmit={({ text }) => setValue(text)}
          />
        </>
      )}
    </ModalGeneric>
  );
};
ModalCatchphraseCV.propTypes = {
  defaultValue: PropTypes.string,
  setValue: PropTypes.func.isRequired,
};
ModalCatchphraseCV.defaultProps = {
  defaultValue: '',
};
export default ModalCatchphraseCV;
