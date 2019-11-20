/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import ModalGeneric from '../ModalGeneric';
import HeaderModal from '../HeaderModal';
import FormWithValidation from '../../forms/FormWithValidation';
import schema from '../../forms/schema/formEditStory';

const ModalStoryCV = ({ defaultValue, setValue }) => {
  schema.fields[0].value = defaultValue;
  return (
    <ModalGeneric id="modalMyStoryCV">
      {(closeModal) => (
        <>
          <HeaderModal>Edition - Mon histoire</HeaderModal>
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
ModalStoryCV.propTypes = {
  defaultValue: PropTypes.string,
  setValue: PropTypes.func.isRequired,
};
ModalStoryCV.defaultProps = {
  defaultValue: '',
};

export default ModalStoryCV;
