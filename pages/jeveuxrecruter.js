/* global UIkit */
import React, {useRef} from 'react';
import Layout from '../components/Layout';
import { Button, Section, IconNoSSR } from '../components/utils';
import { DiscoverPartial } from '../components/partials';
import schema from '../components/forms/schema/formEditOpportunity';
import Api from '../Axios';
import StepperModal from '../components/modals/StepperModal';
import FormWithValidation from '../components/forms/FormWithValidation';
import ImageTitle from "../components/sections/ImageTitle";
import HireSteps from "../components/sections/HireSteps";
import WhatItBrings from "../components/sections/WhatItBrings";
import WaysToJoin from "../components/sections/WaysToJoin";
import Reviews from "../components/sections/Reviews";
import {useResetForm} from "../hooks";

const JeVeuxRecruter = () => {
  const [form, resetForm] = useResetForm();

  const candidatId = schema.fields[
    schema.fields.findIndex((field) => field.id === 'candidatId')
  ];

  candidatId.disabled = () => true;
  candidatId.hidden = () => true;

  schema.fields[
    schema.fields.findIndex((field) => field.id === 'isPublic')
  ].disabled = true;

  return (
    <Layout title="Je veux recruter - LinkedOut">
      <ImageTitle
        img='static/img/header_pic_hire.jpg'
        id="hire-title"
        title={<>Vous souhaitez <span className="uk-text-primary">recruter un candidat LinkedOut ?</span></>}
        text={"La précarité et l'exclusion n'empêchent pas le talent\xa0!"} />
      <Section
        id="makeADifference"
        style="muted"
        container="small">
        <h4 className="uk-align-center uk-text-center">
          Recruteurs, plus qui quiconque, faites la différence&nbsp;! Soyez des acteurs essentiels du projet LinkedOut en donnant la chance à un ou plusieurs candidats correspondant aux compétences que vous recherchez.
        </h4>
      </Section>
      <Section
        id="whereTheyComeFrom"
        style="default">
        <div className="uk-flex uk-flex-column uk-flex-middle">
          <div className="uk-container-small uk-flex uk-flex-column uk-flex-middle">
            <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-small-bottom uk-margin-remove-top">
              D&apos;où viennent les candidats <span className="uk-text-primary">LinkedOut&nbsp;?</span>
            </h2>
            <h3 className="uk-align-center uk-text-center">
              LinkedOut s&apos;adresse à des profils diversifiés ayant comme points communs la capacité et la motivation pour travailler&nbsp;:
            </h3>
          </div>
        </div>
        <div className="uk-margin-medium-top">
          <img src="../static/img/candidats.jpg" alt="" />
            <div className="uk-background-primary uk-light uk-padding uk-flex uk-flex-center">
              <div className="uk-container-small">
                <h4 className="uk-align-center uk-text-center uk-margin-remove">
                  <IconNoSSR name="triangle-right"/>Personnes ayant connu des parcours de rue
                  <br/>
                  <br/>
                  <IconNoSSR name="triangle-right"/>Personnes accueillies dans des structures d&apos;hébergement temporaire (hôtels sociaux, centres d&apos;hébergement d&apos;urgence, etc.)
                  <br/>
                  <br/>
                  <IconNoSSR name="triangle-right"/>Personnes sortant de parcours d&apos;insertion, jeunes en précarité&nbsp;...
                </h4>
              </div>
            </div>
        </div>
      </Section>
      <WaysToJoin />
      <HireSteps />
      <WhatItBrings />
      {/*
        TODO Unhide when we'll have real testimonies
        <Reviews />
      */}
      <DiscoverPartial style='default'/>
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
    </Layout>
  );
};

export default JeVeuxRecruter;
