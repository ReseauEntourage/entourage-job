import React from 'react';
import { Section } from '../utils';

const HowTo = () => {
  const content = [
    {
      img: '/static/img/illustrations/how1.png',
      description: <div>La viralisation des CV repensés de candidats sur les réseaux sociaux via <span className="uk-text-bold">cette plateforme <span className="uk-text-primary">www.linkedout.fr</span></span>, afin de générer des opportunités d’emploi</div>,
    },
    {
      img: '/static/img/illustrations/how2.png',
      description: <div><span className="uk-text-bold">Un accompagnement de proximité</span> avec des bénévoles-coachs avant, pendant mais aussi après le retour à l’emploi</div>,
    },
    {
      img: '/static/img/illustrations/how3.png',
      description: <div><span className="uk-text-bold">Des formations courtes</span> et des ateliers de remobilisation « à la carte » pour acquérir les compétences manquantes et reprendre confiance</div>,
    },
    {
      img: '/static/img/illustrations/how4.png',
      description: <div><span className="uk-text-bold">Une communauté d’entraide</span> et d’amitié, Entourage, offre des temps conviviaux pour se ressourcer et faire de nouvelles rencontres</div>,
    },
  ];


  return (
    <Section id="how" style="muted">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-width-1-2@m">
        Comment fonctionne{' '}
        <span className="uk-text-primary">LinkedOut&nbsp;?</span>
      </h2>
      <div className="uk-flex uk-flex-wrap uk-flex-left uk-flex-around">
        {content.map(({img, description}) => {
          return (
            <div className="uk-flex uk-flex-column uk-flex-middle uk-width-medium">
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
