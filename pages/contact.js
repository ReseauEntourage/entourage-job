/* global UIkit */
import React, {useRef} from 'react';
import Layout from '../components/Layout';
import interestLinkedOutSchema from "../components/forms/schema/formInterestLinkedOut.json";
import {Section} from "../components/utils";
import FormWithValidation from "../components/forms/FormWithValidation";
import Api from "../Axios";

const Contact = () => {
  const form = useRef(null);

  const resetForm = () => {
    if(form.current) form.current.resetForm();
  };

  return (
    <Layout title="Contact - LinkedOut">
      <Section container="small" style="default">
        <h1 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          Formulaire de{' '}
          <span className="uk-text-primary">contact</span>
        </h1>
        <h4 className="uk-align-center uk-text-center uk-margin-large-bottom">
          Vous êtes un acteur de l&apos;insertion sociale et professionnelle intéressé(e) par l’approche de LinkedOut et souhaitez coopérer avec nous&nbsp;? Vous êtes un recruteur et souhaitez en savoir plus sur le dispositif LinkedOut&nbsp;? Ou vous êtes simplement un particulier et avez des questions sur le projet&nbsp;?
        </h4>
        <FormWithValidation
          ref={form}
          submitText="Envoyer"
          formSchema={interestLinkedOutSchema}
          onSubmit={(fields) => {
            Api.post('/api/v1/mail/contact-us', fields)
              .then(() => {
                UIkit.notification("Merci pour votre message.", "success");
                resetForm();
              })
              .catch(() => UIkit.notification("Une erreur s'est produite", "danger"));
          }}
        />
      </Section>
    </Layout>
  );
};

export default Contact;
