import React from 'react';
import Section from '../utils/Section';

const WhatItBringsToCompanies = () => {
  return (
    <Section id="whatItBrings" style="muted">
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
          Ce que LinkedOut <span className="uk-text-primary">vous apporte</span>
        </h2>
        <ul
          uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;"
          className="uk-list uk-list-disc"
        >
          <li className="uk-text-primary">
            <h4 className="uk-text-secondary">
              Une sélection de candidats{' '}
              <span className="uk-text-bold">coachés, prêts et motivés</span>{' '}
              pour travailler
            </h4>
          </li>
          <li className="uk-text-primary">
            <h4 className="uk-text-secondary">
              Le coach du candidat qui joue le{' '}
              <span className="uk-text-bold">rôle de facilitateur</span> pendant
              tout le process de recrutement
            </h4>
          </li>
          <li className="uk-text-primary">
            <h4 className="uk-text-secondary">
              Un{' '}
              <span className="uk-text-bold">
                accompagnement de l’équipe LinkedOut
              </span>{' '}
              à toutes les étapes du recrutement et de l’intégration
            </h4>
          </li>
        </ul>
      </div>
    </Section>
  );
};

WhatItBringsToCompanies.propTypes = {};

WhatItBringsToCompanies.defaultProps = {};

export default WhatItBringsToCompanies;
