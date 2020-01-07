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
import AssociationEntourage from '../components/partials/AssociationEntourage';

const Index = () => {
  return (
    <Layout>
      <LandingPagePartial />
      <Header isHome />
      <CandidatListPartial />
      <EmphasePartial />
      <NumberPartial />
      <DifferencePartial />
      <AssociationEntourage />
    </Layout>
  );
};
export default Index;
