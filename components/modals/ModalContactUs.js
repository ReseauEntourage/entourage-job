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
        <span className="uk-text-primary">
          Je n&apos;ai pas les papiers requis
        </span>{' '}
        pour rejoindre LinkedOut
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
        return (
          <>
            <p
              className="uk-text-lead"
              style={{
                lineHeight: '1.2',
                fontSize: '1.2rem',
                fontWeight: '500',
              }}
            >
              Ma situation actuelle ne me permet pas de rejoindre LinkedOut, je
              souhaite être aidé et orienté dans mes différentes démarches.
            </p>
            <FormContactUsValidation />
          </>
        );
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
