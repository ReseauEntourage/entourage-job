import React, { useMemo } from 'react';
import SuccessModalContent from 'src/components/modals/SuccessModalContent';
import StepperModal from 'src/components/modals/StepperModal';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import interestLinkedOutSchema from 'src/components/forms/schema/formInterestLinkedOut';
import Api from 'src/Axios';

const ModalInterestLinkedOut = () => {
  const Content = useMemo((closeModal, nextStep) => {
    return (
      <FormWithValidation
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
  }, []);

  const Close = useMemo((closeModal) => {
    return (
      <SuccessModalContent
        closeModal={closeModal}
        text="Merci pour votre message."
      />
    );
  }, []);

  return (
    <StepperModal title="Formulaire de contact" composers={[Content, Close]} />
  );
};

export default ModalInterestLinkedOut;
