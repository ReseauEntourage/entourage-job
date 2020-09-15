import React, { useContext } from 'react';
import SuccessModalContent from './SuccessModalContent';
import StepperModal from "./StepperModal";
import FormWithValidation from "../forms/FormWithValidation";
import interestLinkedOutSchema from "../forms/schema/formInterestLinkedOut.json";
import Api from "../../Axios";
import { ModalContext } from '../store/ModalProvider';

const ModalInterestLinkedOut = () => {
  const {
    close,
    setClose,
    form,
    next,
  } = useContext(ModalContext);

  return (
    <div>
      <StepperModal
        id="modal-interest-linkedOut"
        title="Vous êtes intéressés par LinkedOut ?"
        components={[
          <FormWithValidation
            ref={form}
            submitText="Envoyer"
            formSchema={interestLinkedOutSchema}
            onCancel={() => setClose(true)}
            onSubmit={(fields, setError) => {
              Api.post('/api/v1/mail/contact-us', fields)
                .then(() => next())
                .catch(() => setError("Une erreur s'est produite"));
            }}
          />,
          <SuccessModalContent
            text="Merci pour votre message."
          />,
        ]}
      />
    </div>
  );
};

export default ModalInterestLinkedOut;
