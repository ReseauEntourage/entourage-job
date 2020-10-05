import React, {useContext} from 'react';
import Layout from '../components/Layout';
import {
  ActionPartial,
  CandidatListPartial,
  EmphasePartial,
  LandingPagePartial,
  NumberPartial,
} from '../components/partials';

import Header from '../components/headers/Header';
import {SharesCountContext} from '../components/store/SharesCountProvider';
import VendeeGlobePartial from "../components/partials/VendeeGlobePartial";

const Index = () => {

  const {totalShares} = useContext(SharesCountContext);

  return (
    <Layout>
      <LandingPagePartial />
      <Header isHome />
      <CandidatListPartial nbShares={totalShares} />
      <VendeeGlobePartial/>
      <EmphasePartial />
      <NumberPartial nbShares={totalShares} />
      <ActionPartial style="default" />
    </Layout>
  );
};
export default Index;
