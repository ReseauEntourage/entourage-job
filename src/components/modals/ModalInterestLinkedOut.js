import React from 'react';
import SuccessModalContent from 'src/components/modals/SuccessModalContent';
import StepperModal from 'src/components/modals/StepperModal';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import interestLinkedOutSchema from 'src/components/forms/schema/formInterestLinkedOut';
import Api from 'src/Axios';
import { useResetForm } from 'src/hooks/utils';

const ModalInterestLinkedOut = () => {
  const [form, resetForm] = useResetForm();

  return (
    <div>
      <StepperModal
        id="modal-interest-linkedOut"
        title="Formulaire de contact"
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
