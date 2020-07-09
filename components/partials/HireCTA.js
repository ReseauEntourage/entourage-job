/* global UIkit */

import React from 'react';
import PropTypes from 'prop-types';
import {Button, IconNoSSR} from "../utils";
import Grid from '../utils/Grid';
import StepperModal from "../modals/StepperModal";
import FormWithValidation from "../forms/FormWithValidation";
import schema from "../forms/schema/formEditOpportunity";
import Api from "../../Axios";
import {useResetForm} from "../../hooks";

const HireCTA = ({inverse}) => {

  const [form, resetForm] = useResetForm();

  const candidatId = schema.fields[
    schema.fields.findIndex((field) => field.id === 'candidatId')
    ];

  candidatId.disabled = true;
  candidatId.hidden = true;

  schema.fields[
    schema.fields.findIndex((field) => field.id === 'isPublic')
    ].disabled = true;

  const data = [
    {
      title: "Je cherche un candidat",
      text: <div>Je cherche un profil en particulier</div>,
      button: {
        label: "Je découvre les candidats",
        href: "/lescandidats"
      }
    },
    {
      title: "Mon offre d’emploi concerne plusieurs profils",
      text: <div>Vous avez régulièrement des besoins de recrutement&nbsp;? Vous avez plusieurs
                 offres d’emploi à pourvoir&nbsp;?</div>,
      button: {
        label: "J’envoie mon offre à LinkedOut",
        href: process.env.AIRTABLE_LINK_BECOME_COACH,
        modal: "#modal-offer-add",
        external: true
      }
    }
  ];

  return (
    <>
      <Grid
        childWidths={[`1-${data.length}@m`]}
        match
        gap="large"
        items={data.map((item, index) => {
          const shouldInverse = (index % 2 === 0) !== inverse;
          return (
            <div
              className={`${shouldInverse ? 'uk-background-primary' : 'uk-background-secondary'} uk-flex uk-flex-column uk-flex-center`}>
              <div className="uk-padding-large uk-flex uk-flex-column uk-flex-middle uk-flex-1">
                {
                  item.title &&
                  <div className="uk-light uk-flex-1">
                    <h2 className='uk-text-primary uk-margin-remove uk-text-center uk-flex-center uk-flex-middle uk-text-bold uk-flex'>
                      {item.title}
                    </h2>
                  </div>

                }
                {
                  item.text &&
                  <div className="uk-light uk-flex-1">
                    <div className='uk-text-primary uk-margin-medium-top uk-text-center'>
                      {item.text}
                    </div>
                  </div>
                }
                {
                  item.button &&
                  <div className={`${shouldInverse ? ' uk-light' : ''} uk-margin-medium-top uk-flex-center uk-flex uk-flex-middle`}>
                    <Button
                      href={item.button.href}
                      style='secondary'
                      isExternal={item.button.external}
                      newTab={item.button.external}
                      toggle={item.button.modal}>
                      {item.button.label}{' '}<IconNoSSR name="chevron-right" />
                    </Button>
                  </div>
                }
              </div>
            </div>
          );
        })}
      />
      <div>
        <StepperModal
          id="modal-offer-add"
          title="Proposer une opportunité"
          resetForm={resetForm}
          composers={[
            (closeModal, nextStep) => (
              <div>
                <p>
                  Cet espace est dédié aux potentiels recruteurs qui souhaitent
                  proposer des opportunités aux candidats. Écrivez vos mots
                  d&apos;encouragement ou contactez le coach plus bas dans la
                  page CV !
                </p>
                <FormWithValidation
                  ref={form}
                  submitText="Envoyer"
                  formSchema={schema}
                  onCancel={closeModal}
                  onSubmit={(opportunity) => {
                    Api.post('/api/v1/opportunity/', opportunity)
                      .then(nextStep)
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
              </div>
            ),
            (closeModal) => (
              <div className="uk-flex uk-flex-center uk-margin-large">
                <div className="uk-card uk-card-body uk-text-center">
                  <IconNoSSR name="check" ratio={4} className="uk-text-primary" />
                  <p className="uk-text-lead">
                    Merci pour votre offre, nous reviendrons bientôt vers vous.
                  </p>
                  <Button
                    style="secondary"
                    onClick={closeModal}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            ),
          ]}
        />
      </div>

    </>
  );
};

HireCTA.propTypes = {
  inverse: PropTypes.bool
};

HireCTA.defaultProps = {
  inverse: false
};

export default HireCTA;
