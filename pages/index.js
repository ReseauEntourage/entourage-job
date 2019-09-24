import React from 'react';
import Layout from '../components/Layout';
import {
  LandingPagePartial,
  EmphasePartial,
  CandidatListPartial,
  DifferencePartial,
  ContactPartial,
  NumberPartial,
} from '../components/partials';

const Index = () => {
  const presentations = [
    {
      imgSrc: '/static/img/illustrations/helping_process.png',
      imgAlt: 'profiles',
      text: '1. Découvrez les profils des candidats',
    },
    {
      imgSrc: '/static/img/illustrations/flyer_sharing.png',
      imgAlt: 'partage',
      text: '2. Partagez leurs cv, ouvrez leur votre réseau',
    },
    {
      imgSrc: '/static/img/illustrations/friendship.png',
      imgAlt: 'échange',
      text: '3. Permettez leur de trouver un travail',
    },
  ];

  const numbers = [
    { value: 15, description: 'Candidats accompagnés' },
    { value: 342, description: 'CVs partagés sur les réseaux' },
    { value: 5, description: 'Personnes réinsérées' },
  ];

  return (
    <Layout>
      <LandingPagePartial presentations={presentations} />
      <EmphasePartial />
      <CandidatListPartial />
      <DifferencePartial />
      <NumberPartial numbers={numbers} />
      <ContactPartial />
    </Layout>
  );
};
export default Index;
