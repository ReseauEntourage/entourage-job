import React from 'react';
import { Section } from '../utils';
import MultipleCTA from './MultipleCTA';

const datas = [
  {
    img: '/static/img/illustrations/steps1.png',
    title: 'Découvrez les profils des candidats',
  },
  {
    img: '/static/img/illustrations/steps2.png',
    title: "Partagez le CV d'un candidat",
  },
  {
    img: '/static/img/illustrations/steps3.png',
    title: 'Laissez la puissance du réseau opérer',
  },
];

const ShareCandidatesCVTutorial = () => (
  <Section style="muted" id="tutorial">
    <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
      LinkedOut en <span className="uk-text-primary">trois</span> étapes
    </h2>
    <MultipleCTA data={datas} showHorizontalDividers showNumbers />
  </Section>
);
export default ShareCandidatesCVTutorial;
