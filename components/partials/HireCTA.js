/* global UIkit */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, IconNoSSR } from "../utils";
import StepperModal from "../modals/StepperModal";
import FormWithValidation from "../forms/FormWithValidation";
import schema from "../forms/schema/formEditOpportunity";
import Api from "../../Axios";
import { mutateFormSchema } from "../../utils";
import { ModalContext } from '../store/ModalProvider';

const HireCTA = ({ id }) => {
  const {
    close,
    setClose,
    form,
    next,
  } = useContext(ModalContext);
  const mutatedSchema = mutateFormSchema(schema, [
    {
      fieldId: 'candidatId',
      props: [
        {
          propName: 'disabled',
          value: true
        },
        {
          propName: 'hidden',
          value: true
        }
      ]
    },
    {
      fieldId: 'isPublic',
      props: [
        {
          propName: 'disabled',
          value: true
        },
        {
          propName: 'hidden',
          value: true
        }
      ]
    },
  ], id);

  return (
    <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
      <div
        className="uk-background-primary uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-flex-middle uk-padding-large uk-width-1-2@m">
        <div className="uk-light uk-flex-1">
          <h2 className='uk-text-primary uk-margin-remove uk-text-center uk-flex-center uk-flex-middle uk-text-bold uk-flex'>
            Vous souhaitez recruter&nbsp;?
              </h2>
        </div>
        <div className="uk-light uk-flex-1">
          <div className='uk-text-primary uk-margin-medium-top uk-text-center'>
            Recherchez le candidat qui correspond à vos besoins et proposez lui votre offre
              </div>
        </div>
        <div className="uk-light uk-margin-medium-top uk-flex-center uk-flex uk-flex-middle">
          <Button
            href="/candidats"
            style='secondary'>
            Trouver le bon candidat LinkedOut{' '}<IconNoSSR name="chevron-right" />
          </Button>
        </div>
      </div>
      <div className="uk-text-bold uk-margin-medium-top uk-text-center">
        Votre offre peut concerner plusieurs candidats LinkedOut&nbsp;?{' '}
        <a
          style={{
            textDecoration: 'underline'
          }}
          className="uk-link-text"
          data-uk-toggle={`#modal-offer-add-${id}`}>
          Publiez votre offre ici&nbsp;!
        </a>
      </div>
      <StepperModal
        id={`modal-offer-add-${id}`}
        title="Proposer une opportunité"
        components={[
          <div>
            <p>
              Cet espace est dédié aux potentiels recruteurs qui souhaitent
              proposer une opportunité visible par tous les candidats.
              </p>
            <FormWithValidation
              ref={form}
              submitText="Envoyer"
              formSchema={mutatedSchema}
              onCancel={() => setClose(true)}
              onSubmit={(opportunity) => {
                Api.post('/api/v1/opportunity/', {
                  ...opportunity,
                  date: Date.now()
                })
                  .then(next)
                  .catch((error) => {
                    console.error(error);
                    UIkit.notification(
                      "Une erreur s'est produite lors de l'envoie de l'offre",
                      { pos: 'bottom-center', status: 'danger' }
                    );
                  });
              }}
              defaultValues={{
                isPublic: true
              }}
            />
          </div>,
          <div className="uk-flex uk-flex-center uk-margin-large">
            <div className="uk-card uk-card-body uk-text-center">
              <IconNoSSR name="check" ratio={4} className="uk-text-primary" />
              <p className="uk-text-lead">
                Merci pour votre offre, nous reviendrons bientôt vers vous.
                </p>
              <Button
                style="secondary"
                onClick={() => setClose(close)}
              >
                Fermer
                </Button>
            </div>
          </div>,
        ]}
      />
    </div>
  );
};

HireCTA.propTypes = {
  id: PropTypes.string.isRequired,
};

HireCTA.defaultProps = {
};

export default HireCTA;
