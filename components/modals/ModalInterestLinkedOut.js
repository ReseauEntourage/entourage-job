import React, {useRef} from 'react';
import SuccessModalContent from './SuccessModalContent';
import StepperModal from "./StepperModal";
import FormWithValidation from "../forms/FormWithValidation";
import interestLinkedOutSchema from "../forms/schema/formInterestLinkedOut.json";
import Api from "../../Axios";

const ModalInterestLinkedOut = () => {
  const form = useRef(null);

  const resetForm = () => {
    form.current.resetForm();
  };

  return (
    <StepperModal
      id="modal-interest-linkedOut"
      title="Vous êtes intéressés par LinkedOut ?"
      resetForm={resetForm}
      composers={[
        (closeModal, nextStep) => (
          <FormWithValidation
            ref={form}
            submitText="Envoyer"
            formSchema={interestLinkedOutSchema}
            onCancel={closeModal}
            onSubmit={(fields, setError) => {
              Api.post('/api/v1/mail/contact-us', fields)
                .then(() => nextStep())
                .catch(() => setError("Une erreur s'est produite"));
            }}
          />
        ),
        (closeModal) => (
          <SuccessModalContent
            closeModal={closeModal}
            text="Merci pour votre message."
          />
        ),
      ]}
    />
  );
};

export default ModalInterestLinkedOut;
