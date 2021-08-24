/* global UIkit */

import React from 'react';
import { event } from '../../lib/gtag';
import TAGS from '../../constants/tags';
import { Button, IconNoSSR } from '../utils';
import StepperModal from './StepperModal';
import FormWithValidation from '../forms/FormWithValidation';
import schema from '../forms/schema/formEditOpportunity';
import Api from '../../Axios';
import { useResetForm } from '../../hooks/utils';
import { mutateFormSchema } from '../../utils';

const formId = 'post-job-ad';
export const modalId = `modal-${formId}`;

const PostJobAdModal = () => {
  const [form, resetForm] = useResetForm();

  const mutatedSchema = mutateFormSchema(
    schema,
    [
      {
        fieldId: 'candidatesId',
        props: [
          {
            propName: 'disabled',
            value: true,
          },
          {
            propName: 'hidden',
            value: true,
          },
        ],
      },
      {
        fieldId: 'isPublic',
        props: [
          {
            propName: 'disabled',
            value: true,
          },
          {
            propName: 'hidden',
            value: true,
          },
        ],
      },
    ],
    formId
  );

  return (
    <StepperModal
      id={modalId}
      title="Proposer une opportunité"
      resetForm={resetForm}
      composers={[
        (closeModal, nextStep) => {
          return (
            <div>
              <p>
                Cet espace est dédié aux potentiels recruteurs qui souhaitent
                proposer une opportunité visible par tous les candidats.
              </p>
              <FormWithValidation
                ref={form}
                submitText="Envoyer"
                formSchema={mutatedSchema}
                onCancel={closeModal}
                onSubmit={(opportunity) => {
                  Api.post('/api/v1/opportunity/', {
                    ...opportunity,
                    date: Date.now(),
                  })
                    .then(nextStep)
                    .catch((error) => {
                      console.error(error);
                      UIkit.notification(
                        "Une erreur s'est produite lors de l'envoi de l'offre",
                        { pos: 'bottom-center', status: 'danger' }
                      );
                    });
                }}
                defaultValues={{
                  isPublic: true,
                }}
              />
            </div>
          );
        },
        (closeModal) => {
          event(TAGS.POPUP_OFFRE_ENVOYER_OFFRE_GENERALE_CLIC);
          return (
            <div className="uk-flex uk-flex-center uk-margin-large">
              <div className="uk-card uk-card-body uk-text-center">
                <IconNoSSR name="check" ratio={4} className="uk-text-primary" />
                <p className="uk-text-lead">
                  Merci pour votre offre, nous reviendrons bientôt vers vous.
                </p>
                <div className="uk-flex uk-flex-center">
                  <Button style="secondary" onClick={closeModal}>
                    Fermer
                  </Button>
                </div>
              </div>
            </div>
          );
        },
      ]}
    />
  );
};

export default PostJobAdModal;
