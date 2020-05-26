import React from 'react';
import { Section } from '../utils';

const HowToJoin = () => {
  const content = [
    {
      img: '/static/img/id_card.png',
      description: <div><span className="uk-text-bold">Carte Nationale d&apos;Identité</span> (ou carte résident avec autorisation de travail / Titre de séjour)</div>,
    },
    {
      img: '/static/img/domiciliation.png',
      description: <div><span className="uk-text-bold">Domiciliation</span></div>,
    },
    {
      img: '/static/img/social_security.png',
      description: <div><span className="uk-text-bold">Attestation de sécurité sociale</span></div>,
    },
    {
      img: '/static/img/bank.png',
      description: <div><span className="uk-text-bold">Compte bancaire</span></div>,
    },
  ];


  return (
    <Section id="howToJoin" container="small" style="default">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
        Comment rejoindre{' '}
        <span className="uk-text-primary">LinkedOut&nbsp;?</span>
      </h2>
      <h3 className="uk-align-center uk-text-center">
        Vous êtes en démarche d’insertion professionnelle et motivés pour être acteur de votre recherche
      </h3>
      <p className="uk-margin-large-top uk-width-large">Vous rassemblez les éléments suivants, nécessaires à l’obtention d’un contrat de travail&nbsp;:</p>
      <div className="uk-width-expand uk-flex uk-flex-wrap uk-flex-left uk-flex-center uk-flex-around">
        {content.map(({img, description}, index) => {
          return (
            <div key={index.toString()} className="uk-flex uk-flex-column uk-flex-middle uk-width-1-4@m uk-padding-small uk-padding-remove-horizontal">
              <div className="uk-height-small uk-flex uk-flex-bottom uk-flex-center">
                <img src={img} width="100" height="150" alt=""/>
              </div>
              <div className="uk-padding-small uk-margin-medium-top uk-flex uk-flex-top">
                <div className="uk-text-primary">&gt;&nbsp;</div>
                <div className="uk-flex-1">
                  {description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

HowToJoin.propTypes = {

};

HowToJoin.defaultProps = {
};

export default HowToJoin;
