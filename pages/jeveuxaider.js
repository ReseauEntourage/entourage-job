import React from 'react';
import { Section } from '../components/utils';
import { DiscoverPartial } from '../components/partials';
import Layout from '../components/Layout';
import ProfilAidant from '../components/sections/ProfilAidant';
import HowTo from '../components/sections/HowTo';
import StepCard from '../components/cards/StepCard';

const JeVeuxAider = () => (
  <Layout title="Je veux aider - Entourage Jobs">
    <Section id="titre">
      <h1 className="uk-heading-medium uk-text-bold uk-text-center">
        Vous souhaitez <span className="uk-text-primary">aider ?</span>
      </h1>
      <p className="uk-text-lead uk-text-center" style={{ fontWeight: '600' }}>
        Il n&apos;y a pas de petit coup de pouce, aidez à votre échelle !
      </p>
    </Section>
    <ProfilAidant />
    <HowTo
      title={
        <h1 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-width-1-2@m">
          Comment fonctionne{' '}
          <span className="uk-text-primary">LinkedOut ?</span>
        </h1>
      }
      colLarge={3}
    >
      <StepCard
        numStep={1}
        img="/static/img/illustrations/entourage_phone.png"
        description="La plateforme LinkedOut permet de viraliser les CV des candidats sur les réseaux sociaux pour les rendre visibles auprès de recruteurs et générer des opportunités d'emploi"
      />
      <StepCard
        numStep={2}
        img="/static/img/illustrations/helping_process.png"
        description="Chaque candidat est soutenu par un bénévole-coach, de la recherche d’emploi à l’intégration en entreprise"
      />
      <StepCard
        numStep={3}
        img="/static/img/illustrations/Idee-reseau-entourage-dessin.png"
        description="Un parcours de courtes formations et d’ateliers à la carte permet aux candidats qui le souhaitent d’acquérir les compétences manquantes et de travailler la confiance en soi"
      />
    </HowTo>
    <Section id="travailler3" style="secondary" size="small">
      <p className="uk-text-lead uk-text-center uk-align-center uk-width-2-3@s">
        Tout au long de leur parcours vers l&apos;emploi, la communauté
        Entourage soutient moralement les candidats, leur permet de se
        resocialiser et de faire de nouvelles rencontres
      </p>
      <p className="uk-text-center">Découvrez Entourage</p>
    </Section>
    <DiscoverPartial />
  </Layout>
);

export default JeVeuxAider;
