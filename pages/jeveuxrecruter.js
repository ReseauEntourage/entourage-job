/* global UIkit */
import React from 'react';
import Layout from '../components/Layout';
import { Button, Section, GridNoSSR, IconNoSSR } from '../components/utils';
import { DiscoverPartial } from '../components/partials';
import { ReviewCard } from '../components/cards';
import HowItWorks from '../components/sections/HowItWorks';
import StepCard from '../components/cards/StepCard';
import schema from '../components/forms/schema/formEditOpportunity';
import Api from '../Axios';
import StepperModal from '../components/modals/StepperModal';
import FormWithValidation from '../components/forms/FormWithValidation';
import ImageTitle from "../components/sections/ImageTitle";
import SimpleSection from "../components/sections/SimpleSection";
import MultipleCTA from "../components/partials/MultipleCTA";
import HireSteps from "../components/sections/HireSteps";
import Carousel from "../components/utils/Carousel";
import Grid from "../components/utils/Grid";
import WhatItBrings from "../components/sections/WhatItBrings";

const JeVeuxRecruter = () => {
  const waysToJoin = [
    {
      text: <div>En fin de parcours d’insertion, les candidats nous sont <span className="uk-text-bold">orientés par les chargées d’accompagnement</span> des structures d’insertion professionnelles</div>,
    },
    {
      text: <div>Les candidats sont <span className="uk-text-bold">orientés par les travailleurs sociaux d’associations partenaires</span> ou de dispositif publics</div>,
    },
    {
      text: <div>Les candidats sont orientés par <span className="uk-text-bold">des membres du réseau Entourage</span></div>,
    },
    {
      text: <div>Les candidats <span className="uk-text-bold">candidatent spontanément</span> depuis le site internet</div>,
    },
  ];

  const reviews = [
    {
      author: 'Paul Jean',
      colorClass: 'uk-text-primary',
      picture: '/static/img/arthur.png',
      review:
        "Nous avons intégré Zineb à l'équipe il y a maintenant 6 mois. Tout a été rendu facile par Entourage et les équipes de travail sont très satisfaites.",
      role: 'Directeur RH chez Sanofi',
    },
    {
      author: 'Stéphane Joli',
      colorClass: '',
      picture: '/static/img/arthur.png',
      review:
        "Mohamed s'est fondu dans le groupe en un clin d'oeil, tout le monde a l'impression qu'il est là depuis 10 ans.",
      role: 'Recruteur pour LVMH',
    },
    {
      author: 'Jeanne Pierrot ',
      colorClass: 'uk-text-primary',
      picture: '/static/img/arthur.png',
      review:
        "La réinsertion est rendue plus facile grâce à Entourage Jobs, et c'est une belle victoire pour les candidats et pour les entreprises. Continuez !",
      role: 'Directrice RH chez Le grand Breguet',
    },
    {
      author: 'Paul Jean',
      colorClass: 'uk-text-primary',
      picture: '/static/img/arthur.png',
      review:
        "Nous avons intégré Zineb à l'équipe il y a maintenant 6 mois. Tout a été rendu facile par Entourage et les équipes de travail sont très satisfaites.",
      role: 'Directeur RH chez Sanofi',
    },
    {
      author: 'Stéphane Joli',
      colorClass: '',
      picture: '/static/img/arthur.png',
      review:
        "Mohamed s'est fondu dans le groupe en un clin d'oeil, tout le monde a l'impression qu'il est là depuis 10 ans.",
      role: 'Recruteur pour LVMH',
    },
    {
      author: 'Jeanne Pierrot ',
      colorClass: 'uk-text-primary',
      picture: '/static/img/arthur.png',
      review:
        "La réinsertion est rendue plus facile grâce à Entourage Jobs, et c'est une belle victoire pour les candidats et pour les entreprises. Continuez !",
      role: 'Directrice RH chez Le grand Breguet',
    },
  ];

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
        img='static/img/header_pic.jpg'
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
        style="default"
        container="small">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          D&apos;où viennent les candidats <span className="uk-text-primary">LinkedOut&nbsp;?</span>
        </h2>
        <h4 className="uk-align-center uk-text-center">
          LinkedOut s&apos;adresse à des profils diversifiés ayant comme points communs la capacité et la motivation pour travailler&nbsp;:
          <br/>
          <span>
            personnes ayant connus des parcours de rue, personnes accueillies dans des structures d&apos;hébergement temporaires (hotels sociaux, centre d&apos;hébergement d&apos;urgence, etc.) personnes sortants de parcours d&apos;insertion, jeunes en précarité&nbsp;...
          </span>
        </h4>
      </Section>
      <Section
        id="waysToJoin"
        style="muted"
        container="small">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          Plusieurs <span className="uk-text-primary">manières de rejoindre</span> LinkedOut
        </h2>
        <MultipleCTA
          data={waysToJoin}
          showVerticalDividers
          spacing='small'
          className="uk-margin-large-bottom"
        />
        <MultipleCTA
          data={[
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
              text: <div>Vous avez régulièrement des besoins de recrutement&nbsp;? Vous avez plusieurs offres d’emploi à pourvoir&nbsp;?</div>,
              button: {
                label: "J’envoie mon offre à LinkedOut",
                href: process.env.AIRTABLE_LINK_BECOME_COACH,
                modal: "#modal-offer-add"
              }
            }
          ]}
          showHorizontalDividers
        />
      </Section>
      <HireSteps />
      <WhatItBrings />
      <Section id="testimony">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          <span className="uk-text-primary">LinkedOut plebiscité</span>{' '}
          par les recruteurs...
        </h2>
        <h4 className="uk-align-center uk-text-center uk-margin-medium-bottom">
          Le retour des recruteurs en entreprise est unanime&nbsp;: l&apos;arrivée des candidats fédère les salariés et transforme le projet d&apos;entreprise en une véritable aventure humaine, porteuse de sens pour tous&nbsp;!
        </h4>
        <div className="uk-width-expand">
          <Carousel
            itemRenderer={(review, index) => (
              <div key={index.toString()}>
                <ReviewCard
                  author={review.author}
                  colorclassName={review.colorClass}
                  key={index}
                  review={review.review}
                  role={review.role}
                />
              </div>
            )}
            style="default"
            items={reviews}
            containerClasses="uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-4@m uk-grid uk-grid-match uk-grid-small" />
        </div>
      </Section>
      <DiscoverPartial style='muted'/>
      <StepperModal
        id="modal-offer-add"
        title="Proposer une opportunité"
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
                  style="primary"
                  onClick={closeModal}
                >
                  Fermer
                </Button>
              </div>
            </div>
          ),
        ]}
      />
    </Layout>
  );
};

export default JeVeuxRecruter;
