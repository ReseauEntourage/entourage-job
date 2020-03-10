import React from 'react';
import Layout from '../components/Layout';
import {
  CandidatListPartial,
  ContactPartial,
  DifferencePartial,
  EmphasePartial,
  LandingPagePartial,
  NumberPartial,
  SharePartial,
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
      <DifferencePartial />
      <ContactPartial />
      <SharePartial />
    </Layout>
  );
};
export default Index;
