/* eslint-disable no-undef */
import React from 'react';
import FormContactUs from '../forms/FormContactUs';
import withValidation from '../forms/withValidation';
import rulesContactUs from '../forms/rulesContactUs';
import SuccessModalContent from './SuccessModalContent';
import StepperModal from './StepperModal';

// Modal de formulaire contact
const ModalContactUs = () => (
  <StepperModal
    id="modalContactUs"
    title={
      <>
        Vous souhaitez{' '}
        <span className="uk-text-primary">apporter vos compétences ?</span>
      </>
    }
    composers={[
      (closeModal, nextStep) => {
        const FormContactUsValidation = withValidation(
          FormContactUs,
          rulesContactUs,
          closeModal,
          nextStep
        );
        return <FormContactUsValidation />;
      },
      (closeModal) => (
        <SuccessModalContent
          text="Merci pour votre message."
          closeModal={closeModal}
        />
      ),
    ]}
  />
);
export default ModalContactUs;
