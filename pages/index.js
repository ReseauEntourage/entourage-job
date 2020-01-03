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
import Header from '../components/headers/Header';

const Index = () => {
  const numbers = [
    { value: 15, description: 'Candidats accompagnés' },
    { value: 342, description: 'CVs partagés sur les réseaux' },
    { value: 5, description: 'Personnes réinsérées' },
  ];

  return (
    <Layout>
      <LandingPagePartial />
      <Header />
      <CandidatListPartial />
      <EmphasePartial />

      {/*
      <DifferencePartial />
      <NumberPartial numbers={numbers} />
      <ContactPartial /> */}
    </Layout>
  );
};
export default Index;
