/* global UIkit */
import React from 'react';
import Layout from 'src/components/Layout';
import interestLinkedOutSchema from 'src/components/forms/schema/formInterestLinkedOut.json';
import { Section } from 'src/components/utils';
import FormWithValidation from 'src/components/forms/FormWithValidation';
import Api from 'src/Axios';
import { useResetForm } from 'src/hooks/utils';
import SimpleLink from 'src/components/utils/SimpleLink';

const Contact = () => {
  const [form, resetForm] = useResetForm();

  const contactPerCity = {
    Paris: '07 82 44 97 39',
    Lille: '07 83 85 48 95',
    Lyon: '07 67 35 05 86',
    'Autres demandes': '07 67 69 67 61',
  };

  return (
    <Layout title="Contact - LinkedOut">
      <Section container="small" style="default">
        <h1 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          Formulaire de <span className="uk-text-primary">contact</span>
        </h1>
        <h4 className="uk-align-center uk-text-center uk-margin-large-bottom">
          Vous êtes un acteur de l&apos;insertion sociale et professionnelle
          intéressé(e) par l’approche de LinkedOut et souhaitez coopérer avec
          nous&nbsp;? Vous êtes un recruteur et souhaitez en savoir plus sur le
          dispositif LinkedOut&nbsp;? Ou vous êtes simplement un particulier et
          avez des questions sur le projet&nbsp;?
        </h4>
        <FormWithValidation
          ref={form}
          submitText="Envoyer"
          formSchema={interestLinkedOutSchema}
          onSubmit={(fields) => {
            Api.post('/api/v1/mail/contact-us', fields)
              .then(() => {
                UIkit.notification('Merci pour votre message.', 'success');
                resetForm();
              })
              .catch(() => {
                return UIkit.notification(
                  "Une erreur s'est produite",
                  'danger'
                );
              });
          }}
        />
        <h4 className="uk-align-center uk-text-center uk-margin-large-bottom">
          Vous êtes journaliste&nbsp;? Contactez-nous :
          <br />
          <br />
          <SimpleLink
            className="uk-link uk-margin-small-top uk-margin-small-bottom"
            href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
            newTab
            isExternal
          >
            {process.env.MAILJET_CONTACT_EMAIL}
          </SimpleLink>
          <br />
          <div className="uk-margin-small-top uk-text-italic uk-text-muted">
            ou
          </div>
          <ul className="uk-list">
            {Object.keys(contactPerCity).map((contact) => {
              return (
                <li key={contact}>
                  <span className="uk-text-bold">{contact}&nbsp;:&nbsp;</span>
                  <SimpleLink
                    className="uk-link"
                    href={`tel:${contactPerCity[contact]}`}
                    newTab
                    isExternal
                  >
                    {contactPerCity[contact]}
                  </SimpleLink>
                </li>
              );
            })}
          </ul>
        </h4>
      </Section>
    </Layout>
  );
};

export default Contact;
