/* eslint-disable no-undef */
import React from 'react';
import FormWithValidation from '../forms/FormWithValidation';
import rulesContactUs from '../forms/schema/formContactUs';
import SuccessModalContent from './SuccessModalContent';
import StepperModal from './StepperModal';
import Api from '../../Axios';

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
      (closeModal, nextStep) => (
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
          <FormWithValidation
            formSchema={rulesContactUs}
            onCancel={closeModal}
            onSubmit={({ email, text }, reject) =>
              Api.post('/mail/contact-us', { email, text })
                .then(nextStep)
                .catch(() => reject("Une erreur s'est produite"))
            }
          />
        </>
      ),
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
