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
import SimpleCTA from "../components/partials/SimpleCTA";
import MultipleCTA from "../components/partials/MultipleCTA";
import HireSteps from "../components/sections/HireSteps";
import Carousel from "../components/utils/Carousel";

const JeVeuxRecruter = () => {
  const waysToJoin = [
    {
      description: <div>En fin de parcours d’insertion, ils nous sont <span className="uk-text-bold">orientés par les chargées d’accompagnement</span> des structures d’insertion professionnelles</div>,
    },
    {
      description: <div>Ils sont <span className="uk-text-bold">orientés par les travailleurs sociaux d’associations partenaires</span> (Armée du Salut, Aurore, Emmaüs Solidarité,...)</div>,
    },
    {
      description: <div>Ils sont orientés par <span className="uk-text-bold">des membres du réseau Entourage</span></div>,
    },
    {
      description: <div>Ils <span className="uk-text-bold">candidatent spontanément</span> depuis le site internet</div>,
    },
  ];

  const whatItBrings = [
    {
      description: <div><span className="uk-text-bold">Des candidats prêts et motivés pour travailler</span>, accompagnés individuellement pendant la recherche et après la reprise d’emploi par un bénévole coach</div>,
    },
    {
      description: <div>L’équipe LinkedOut vous <span className="uk-text-bold">accompagne dans votre recrutement inclusif</span> (kit d’accueil et d’intégration du candidat, interlocuteur privilégié, prise de feedback régulière...)</div>,
    },
    {
      description: <div><span className="uk-text-bold">Des événements conviviaux avec un réseau d’entreprises engagées</span>, fédérées autour d’une même vision de société plus inclusive</div>,
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
        text={"La précarité et l'exclusion n'empêchent pas le talent\xa0! Recruteurs, plus qui quiconque, faites la différence\xa0! Soyez des acteurs essentiels du projet LinkedOut en donnant la chance à un ou plusieurs candidats correspondant aux compétences que vous recherchez"} />
      <SimpleCTA
        title={
          <>
            D&apos;où viennent les candidats <span className="uk-text-primary">LinkedOut&nbsp;?</span>
          </>
        }
        text={"LinkedOut s'adresse à des profils diversifiés ayant comme points communs la capacité et la motivation pour travailler\xa0: personnes ayant connus des parcours de rue, personnes accueillies dans des structures d'hébergement temporaires (hotels sociaux, centre d'hébergement d'urgence,...), personnes sortants de parcours d'insertion, jeunes en précarité, etc..."}
        id="actor"
        style="muted">
        <div className="uk-background-default uk-width-expand uk-padding-large">
          <div className="uk-overflow-hidden">
            <h3 className="uk-text-bold uk-text-primary uk-width-large">Les candidats peuvent rejoindre LinkedOut de différentes manières&nbsp;:</h3>
            <div className="uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-4@m uk-grid uk-grid-match uk-grid-small uk-grid-divider">
              {waysToJoin.map(({description}, index) => <div key={index.toString()} className="">{description}</div>)}
            </div>
          </div>
        </div>
        <h3 className="uk-text-center uk-margin-medium-bottom">
          LinkedOut accompagne les candidats dans l’apprentissage des codes de l’entreprise par le soutien individualisé des bénévoles-coach, des immersions possibles en entreprises et grâce au réseau d’anciens candidats LinkedOut qui transmettent leur expérience.
        </h3>
        <MultipleCTA
          data={[
            {
              title: "Je cherche un candidat",
              button: {
                label: "Je découvre le candidat dont j’ai besoin",
                href: "/lescandidats"
              }
            },
            {
              title: "Mon offre d’emploi concerne plusieurs profils",
              button: {
                label: "J’envoie mon offre à LinkedOut",
                href: process.env.AIRTABLE_LINK_BECOME_COACH,
                modal: "#modal-offer-add"
              }
            }
          ]}
        />
      </SimpleCTA>
      <Section container="small" style="default">
        <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom">
            Ce que LinkedOut <span className="uk-text-primary">vous apporte</span>
          </h2>
          <div className="uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@m uk-grid uk-grid-match uk-grid-small">
            <div>
              <div className="uk-card uk-card-body uk-background-primary" style={{color: 'white'}}>{whatItBrings[0].description}</div>
            </div>
            <div>
              <div className="uk-card uk-card-body uk-background-secondary" style={{color: 'white'}}>{whatItBrings[1].description}</div>
            </div>
            <div>
              <div className="uk-card uk-card-body uk-background-muted">{whatItBrings[2].description}</div>
            </div>
          </div>
        </div>
      </Section>
      <HireSteps />
      <Section id="testimony">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom">
          <span className="uk-text-primary">LinkedOut plebiscité</span>{' '}
          par les recruteurs...
        </h2>
        <h3 className="uk-align-center uk-text-center">
          Le retour des recruteurs en entreprise est unanime&nbsp;: l&apos;arrivée des candidats fédère les salariés et transforme le projet d&apos;entreprise en une véritable aventure humaine, porteuse de sens pour tous !
        </h3>
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
                <button
                  type="button"
                  className="uk-button uk-button-primary"
                  onClick={closeModal}
                >
                  Fermer
                </button>
              </div>
            </div>
          ),
        ]}
      />
    </Layout>
  );
};

export default JeVeuxRecruter;
