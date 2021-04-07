import React from 'react';
import SuccessModalContent from './SuccessModalContent';
import StepperModal from './StepperModal';
import FormWithValidation from '../forms/FormWithValidation';
import interestLinkedOutSchema from '../forms/schema/formInterestLinkedOut.json';
import Api from '../../Axios';
import { useResetForm } from '../../hooks';

const ModalInterestLinkedOut = () => {
  const [form, resetForm] = useResetForm();

  return (
    <div>
      <StepperModal
        id="modal-interest-linkedOut"
        title="Vous êtes intéressés par LinkedOut ?"
        resetForm={resetForm}
        composers={[
          (closeModal, nextStep) => {
            return (
              <FormWithValidation
                ref={form}
                submitText="Envoyer"
                formSchema={interestLinkedOutSchema}
                onCancel={closeModal}
                onSubmit={(fields, setError) => {
                  Api.post('/api/v1/mail/contact-us', fields)
                    .then(() => {
                      return nextStep();
                    })
                    .catch(() => {
                      return setError("Une erreur s'est produite");
                    });
                }}
              />
            );
          },
          (closeModal) => {
            return (
              <SuccessModalContent
                closeModal={closeModal}
                text="Merci pour votre message."
              />
            );
          },
        ]}
      />
    </div>
  );
};

export default ModalInterestLinkedOut;
