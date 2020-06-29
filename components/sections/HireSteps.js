import React from 'react';
import { Section } from '../utils';
import MultipleCTA from "../partials/MultipleCTA";

const HireSteps = () => {
  const content = [
    {
      img: '/static/img/illustrations/hire1.png',
      title: 'Repérez un candidat',
      text: <div>Repérez le candidat LinkedOut qui correspond aux compétences que vous cherchez et envoyez-lui votre offre</div>,
    },
    {
      img: '/static/img/illustrations/hire2.png',
      title: 'Le candidat vous recontacte',
      text: <div>Le candidat étudie votre offre avec son bénévole-coach puis vous recontacte, vous le rencontrez</div>,
    },
    {
      img: '/static/img/illustrations/hire3.png',
      title: 'LinkedOut vous accompagne',
      text: <div>L&apos;équipe LinkedOut et le bénévole-coach du candidat vous accompagnent et vous donnent les outils pour l&apos;accueillir et l&apos;intégrer dans votre organisation</div>,
    }
  ];


  return (
    <Section id="hireSteps" style="default">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
        Concrètement,{' '}
        <span className="uk-text-primary">comment recruter</span>
        {' '}un candidat LinkedOut&nbsp;?
      </h2>
      <MultipleCTA data={content} showNumbers showHorizontalDividers />
    </Section>
  );
};

HireSteps.propTypes = {

};

HireSteps.defaultProps = {
};

export default HireSteps;
