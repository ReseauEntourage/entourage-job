/* global UIkit */

import React, {useEffect} from 'react';
import Layout from '../components/Layout';
import {
  ActionPartial,
  CandidatListPartial,
  EmphasePartial,
  LandingPagePartial,
  NumberPartial,
} from '../components/partials';
import Header from '../components/headers/Header';
import ContestModal from "../components/modals/ContestModal";

const Index = () => {

  useEffect(() => {
    UIkit.modal(`#modal-contest`).show();
  }, []);

  return (
    <Layout>
      <LandingPagePartial />
      <Header isHome />
      <CandidatListPartial />
      <EmphasePartial />
      <NumberPartial />
      <ActionPartial style="default" />
      <ContestModal />
    </Layout>
  );
};
export default Index;
