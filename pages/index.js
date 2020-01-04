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
  return (
    <Layout>
      <LandingPagePartial />
      <Header isHome />
      <CandidatListPartial />
      <EmphasePartial />
      <NumberPartial />

      {/*
      <DifferencePartial />
      <ContactPartial /> */}
    </Layout>
  );
};
export default Index;
