import React from 'react';
import MultipleCTA from '../partials/MultipleCTA';

const WhatItBrings = () => {
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
          dans votre démarche de recrutement inclusif (kit d'intégration,
          interlocuteur privilégié...).
        </div>
      ),
    },
    {
      text: (
        <div>
          Tous les candidats ont un logement stable ou temporaire, bénéficient
          d’un accompagnement social et ont les papiers pour travailler.
        </div>
      ),
    },
  ];

  return (
    <div id="whatItBrings" className="uk-margin-large-top">
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          Ce que LinkedOut <span className="uk-text-primary">vous apporte</span>
        </h2>
        <MultipleCTA
          data={whatItBrings}
          showVerticalDividers
          spacing="medium"
          className="uk-margin-large-bottom uk-container-small"
        />
      </div>
    </div>
  );
};

WhatItBrings.propTypes = {};

WhatItBrings.defaultProps = {};

export default WhatItBrings;
