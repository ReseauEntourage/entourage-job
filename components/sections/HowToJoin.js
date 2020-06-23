import React from 'react';
import {IconNoSSR, Section} from '../utils';
import Grid from "../utils/Grid";

const HowToJoin = () => {
  const content = [
    {
      img: '/static/img/id_card.png',
      description: <div><span className="uk-text-bold">Carte Nationale d&apos;Identité</span> (ou carte résident avec autorisation de travail / titre de séjour)</div>,
    },
    {
      img: '/static/img/domiciliation.png',
      description: <div><span className="uk-text-bold">Domiciliation</span></div>,
    },
    {
      img: '/static/img/bank.png',
      description: <div><span className="uk-text-bold">Compte bancaire</span></div>,
    },
    {
      img: '/static/img/social_security.png',
      description: <div><span className="uk-text-bold">Attestation de sécurité sociale</span></div>,
    },
  ];

  return (
    <Section id="howToJoin" container="small" style="default">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
        Comment rejoindre{' '}
        <span className="uk-text-primary">LinkedOut&nbsp;?</span>
      </h2>
      <h3 className="uk-align-center uk-text-center">
        Vous êtes en démarche d’insertion professionnelle et motivé(e) pour être acteur de votre recherche&nbsp;!
      </h3>
      <p className="uk-width-large uk-margin-large-bottom uk-margin-large-top">Vous rassemblez les éléments suivants, nécessaires à l’obtention d’un contrat de travail&nbsp;:</p>
      <Grid
        childWidths={[`1-${content.length}@m`]}
        match
        gap="medium"
        items={content.map(({img, description}, index) => {
          return (
            <div key={index.toString()} className="uk-flex uk-flex-column uk-flex-middle">
              <div className="uk-height-small uk-flex uk-flex-bottom uk-flex-center uk-margin-small-bottom uk-padding-small">
                <img src={img} width="" height="" alt="" className="uk-height-max-small"/>
              </div>
              <div className="uk-flex uk-flex-top">
                <div className="uk-text-primary"><IconNoSSR name="triangle-right" />&nbsp;</div>
                <div className="uk-flex-1">
                  {description}
                </div>
              </div>
            </div>
          );
        })}/>
    </Section>
  );
};

HowToJoin.propTypes = {

};

HowToJoin.defaultProps = {
};

export default HowToJoin;
