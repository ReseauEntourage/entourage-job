import React from 'react';
import Layout from '../components/Layout';
import {
  LandingPagePartial,
  EmphasePartial,
  CandidatListPartial,
  DifferencePartial,
  NumberPartial,
} from '../components/partials';
import Header from '../components/headers/Header';
import '../static/css/style.less';

const Index = () => {
  return (
    <Layout>
      <LandingPagePartial />
      <Header isHome />
      <CandidatListPartial />
      <EmphasePartial />
      <NumberPartial />
      <DifferencePartial />
    </Layout>
  );
};
export default Index;
