import React from 'react';
import MultipleCTA from '../partials/MultipleCTA';
import Section from '../utils/Section';

const WhatItBringsToCompanies = () => {
  const whatItBrings = [
    {
      text: (
        <div>
          <span className="uk-text-bold">
            Des candidats prêts et motivés pour travailler
          </span>
          , accompagnés individuellement pendant la recherche et après la
          reprise d’un emploi.
        </div>
      ),
    },
    {
      text: (
        <div>
          <span className="uk-text-bold">
            Un accompagnement par l&apos;équipe LinkedOut&nbsp;
          </span>
          dans votre démarche de recrutement inclusif (kit d&apos;intégration,
          interlocuteur privilégié...).
        </div>
      ),
    },
  ];

  return (
    <Section id="whatItBrings" style="muted">
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          Ce que LinkedOut <span className="uk-text-primary">vous apporte</span>
        </h2>
        <MultipleCTA
          data={whatItBrings}
          spacing="large"
          className="uk-margin-large-bottom uk-container-small uk-text-center"
        />
      </div>
    </Section>
  );
};

WhatItBringsToCompanies.propTypes = {};

WhatItBringsToCompanies.defaultProps = {};

export default WhatItBringsToCompanies;
