import React from 'react';
import { Section } from '../utils';
import MultipleCTA from "../partials/MultipleCTA";

const HowItWorks = () => {
  const content = [
    {
      img: '/static/img/illustrations/how1.png',
      text: <div><span className="uk-text-bold">La plateforme LinkedOut</span> permet de viraliser les CV des candidats sur les réseaux sociaux pour les rendre visibles auprès de recruteurs et générer des opportunités d’emploi</div>,
    },
    {
      img: '/static/img/illustrations/how2.png',
      text: <div>Chaque candidat <span className="uk-text-bold">est soutenu par un bénévole-coach</span>, de la recherche d’emploi à l’intégration en entreprise</div>,
    },
    {
      img: '/static/img/illustrations/how3.png',
      text: <div><span className="uk-text-bold">Un parcours de courtes formations</span> permet aux candidats qui le souhaitent d’acquérir les compétences manquantes et de reprendre confiance</div>,
    },
    {
      img: '/static/img/illustrations/how4.png',
      text: <div>Tout au long de leur parcours vers l’emploi, la <span className="uk-text-bold">communauté Entourage</span> soutient les candidats, leur permet de se ressourcer et de faire de nouvelles rencontres</div>,
    },
  ];


  return (
    <Section id="howItWorks" style="muted">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
        Comment fonctionne{' '}
        <span className="uk-text-primary">LinkedOut&nbsp;?</span>
      </h2>
      <MultipleCTA data={content} />
    </Section>
  );
};

HowItWorks.propTypes = {

};

HowItWorks.defaultProps = {
};

export default HowItWorks;
