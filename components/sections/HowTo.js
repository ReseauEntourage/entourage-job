import React from 'react';
import { Section } from '../utils';

const HowTo = () => {
  const content = [
    {
      img: '/static/img/illustrations/how1.png',
      description: <div><span className="uk-text-bold">La plateforme LinkedOut</span> permet de viraliser les CV des candidats sur les réseaux sociaux pour les rendre visibles auprès de recruteurs et générer des opportunités d’emploi</div>,
    },
    {
      img: '/static/img/illustrations/how2.png',
      description: <div>Chaque candidat <span className="uk-text-bold">est soutenu par un bénévole-coach</span>, de la recherche d’emploi à l’intégration en entreprise</div>,
    },
    {
      img: '/static/img/illustrations/how3.png',
      description: <div><span className="uk-text-bold">Un parcours de courtes formations</span> permet aux candidats qui le souhaitent d’acquérir les compétences manquantes et de reprendre confiance</div>,
    },
    {
      img: '/static/img/illustrations/how4.png',
      description: <div>Tout au long de leur parcours vers l’emploi, la <span className="uk-text-bold">communauté Entourage</span> soutient les candidats, leur permet de se ressourcer et de faire de nouvelles rencontres</div>,
    },
  ];


  return (
    <Section id="how" style="muted">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-width-1-2@m">
        Comment fonctionne{' '}
        <span className="uk-text-primary">LinkedOut&nbsp;?</span>
      </h2>
      <div className="uk-width-expand uk-flex uk-flex-wrap uk-flex-left uk-flex-center uk-flex-around">
        {content.map(({img, description}) => {
          return (
            <div className="uk-flex uk-flex-column uk-flex-middle uk-width-medium uk-padding-small">
              <div className="uk-height-small uk-flex uk-flex-bottom uk-flex-center">
                <img src={img} width="100" height="150" alt=""/>
              </div>
              <div className="uk-padding-small uk-flex uk-flex-top">
                {description}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

HowTo.propTypes = {

};

HowTo.defaultProps = {
};

export default HowTo;
