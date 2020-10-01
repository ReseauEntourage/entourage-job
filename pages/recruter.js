import React from 'react';
import Layout from '../components/Layout';
import { Section } from '../components/utils';
import { DiscoverPartial } from '../components/partials';
import ImageTitle from '../components/sections/ImageTitle';
import HireSteps from '../components/sections/HireSteps';
import WhatItBrings from '../components/sections/WhatItBrings';
import WaysToJoin from '../components/sections/WaysToJoin';
import SimpleSection from '../components/sections/SimpleSection';
import HireCTA from '../components/partials/HireCTA';

const Recruter = () => {
  return (
    <Layout title="Recruter - LinkedOut">
      <ImageTitle
        img="static/img/header_pic_hire.jpg"
        id="hire-title"
        title={
          <>
            Vous souhaitez{' '}
            <span className="uk-text-primary">
              recruter un candidat LinkedOut&nbsp;?
            </span>
          </>
        }
        text={"La précarité et l'exclusion n'empêchent pas le talent\xa0!"}
      />
      <Section id="makeADifference" style="muted" container="small">
        <h4 className="uk-align-center uk-text-center">
          Recruteurs, plus qui quiconque, faites la différence&nbsp;! Soyez des
          acteurs essentiels du projet LinkedOut en donnant la chance à un ou
          plusieurs candidats correspondant aux compétences que vous recherchez.
        </h4>
        <WhatItBrings />
      </Section>
      <SimpleSection
        style="default"
        container="small"
        fontSize="small"
        title={
          <>
            Les candidats LinkedOut sont coachés sur la durée pour une{' '}
            <span className="uk-text-primary">
              intégration en emploi réussie&nbsp;!
            </span>
          </>
        }
        text={
          <ul
            uk-scrollspy="cls:uk-animation-slide-bottom; target: > li, hr; delay: 200;"
            className="uk-list uk-list-primary uk-margin-remove"
          >
            <li>
              LinkedOut s&apos;adresse à des profils diversifiés ayant comme
              points communs la{' '}
              <span className="uk-text-bold uk-text-primary">capacité</span> et
              la{' '}
              <span className="uk-text-bold uk-text-primary">
                motivation pour travailler
              </span>
            </li>
            <hr className="uk-divider-small" />
            <li>
              Ils sont{' '}
              <span className="uk-text-bold uk-text-primary">soutenus</span>{' '}
              individuellement par des{' '}
              <span className="uk-text-bold uk-text-primary">
                bénévoles-coach
              </span>{' '}
              dans leur recherche d’emploi et après la reprise d’un emploi.
            </li>
            <hr className="uk-divider-small" />
            <li>
              Tous candidats ont un{' '}
              <span className="uk-text-bold uk-text-primary">
                logement stable
              </span>{' '}
              ou{' '}
              <span className="uk-text-bold uk-text-primary">temporaire</span>,
              bénéficient d’un{' '}
              <span className="uk-text-bold uk-text-primary">
                accompagnement social
              </span>{' '}
              et ont les{' '}
              <span className="uk-text-bold uk-text-primary">
                papiers nécessaires
              </span>{' '}
              à la réalisation d’un contrat de travail en France.
            </li>
          </ul>
        }
        id="common"
      />
      <WaysToJoin />
      <HireSteps />
      <Section style="muted">
        <HireCTA id="hirePage" />
      </Section>
      {/*
        TODO Unhide when we'll have real testimonies
        <Reviews />
      */}
      <DiscoverPartial style="default" />
    </Layout>
  );
};

export default Recruter;
