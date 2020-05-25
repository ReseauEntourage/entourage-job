import React from 'react';
import { Section } from '../utils';
import MultipleCTA from "../partials/MultipleCTA";

const HireSteps = () => {
  const content = [
    {
      img: '/static/img/illustrations/how1.png',
      title: 'Repérez un candidat',
      text: <div>Vous repérez un candidat et lui envoyez une offre d’emploi.</div>,
    },
    {
      img: '/static/img/illustrations/how2.png',
      title: 'Le candidat vous recontacte',
      text: <div>Le candidat étudie votre offre avec son bénévole coach puis vous recontacte.</div>,
    },
    {
      img: '/static/img/illustrations/how3.png',
      title: 'LinkedOut vous accompagne',
      text: <div>Jusqu’à l’intégration durable du candidat, un interloculteur privilégié est disponible et un kit de sensibilisation pour vous et vos équipes est fourni.</div>,
    }
  ];


  return (
    <Section id="hireSteps" style="muted" container="small">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom">
        Concrètement,{' '}
        <span className="uk-text-primary">comment recruter</span>
        {' '}un candidat LinkedOut&nbsp;?
      </h2>
      <MultipleCTA data={content} showNumbers showDividers />
    </Section>
  );
};

HireSteps.propTypes = {

};

HireSteps.defaultProps = {
};

export default HireSteps;
