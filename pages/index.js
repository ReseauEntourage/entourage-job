import React from 'react';
import Layout from '../components/Layout';
import {
  ActionPartial,
  CandidatListPartial,
  EmphasePartial,
  LandingPagePartial,
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
      <ActionPartial style="default" />
    </Layout>
  );
};
export default Index;
