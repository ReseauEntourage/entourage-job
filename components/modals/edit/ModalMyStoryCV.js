/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import ModalGeneric from '../ModalGeneric';
import HeaderModal from '../HeaderModal';
import withValidation from '../../forms/withValidation';
import FormMyStoryCV from '../../forms/edit/FormMyStoryCV';
import rulesMyStoryCV from '../../forms/edit/rulesMyStoryCV';

const ModalMyStoryCV = ({ story, setStory }) => (
  <ModalGeneric id="modalMyStoryCV">
    <HeaderModal>Edition - phrase d&apos;accroche</HeaderModal>
    {(closeModal) => {
      const FormMyStoryCVValidation = withValidation(
        FormMyStoryCV,
        rulesMyStoryCV,
        closeModal,
        (newStory) => {
          setStory(newStory);
          closeModal();
        }
      );
      return <FormMyStoryCVValidation story={story} />;
    }}
  </ModalGeneric>
);
ModalMyStoryCV.propTypes = {
  story: PropTypes.string,
  setStory: PropTypes.func.isRequired,
};
ModalMyStoryCV.defaultProps = {
  story: '',
};

export default ModalMyStoryCV;
