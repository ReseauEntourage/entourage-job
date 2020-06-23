import React from 'react';
import { Section } from '../utils';
import MultipleCTA from "../partials/MultipleCTA";
import Layout from "../Layout";
import HireCTA from "../partials/HireCTA";

const WhatItBrings = () => {
  const whatItBrings = [
    {
      text: <div><span className="uk-text-bold">Des candidats prêts et motivés pour travailler</span>, accompagnés individuellement pendant la recherche et après la reprise d’un emploi</div>,
    },
    {
      text: <div><span className="uk-text-bold">Un accompagnement par l&apos;équipe LinkedOut </span>dans votre démarche de recrutement inclusif (interlocuteur privilégié, kit d’accueil et d’intégration, échanges de feedback prise de feedback réguliers, etc.)</div>,
    },
    {
      text: <div><span className="uk-text-bold">Des évènements et temps forts</span> à vivre avec un réseau d’entreprises engagées</div>,
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
          showVerticalDividers
          spacing="medium"
          className="uk-margin-large-bottom uk-container-small"
        />
        <HireCTA inverse/>
      </div>
    </Section>
  );
};

WhatItBrings.propTypes = {

};

WhatItBrings.defaultProps = {
};

export default WhatItBrings;
