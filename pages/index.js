import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Layout from '../components/Layout';

import {
  ActionPartial,
  CandidatListPartial,
  LandingPagePartial,
  NumberPartial,
} from '../components/partials';

import Header from '../components/headers/Header';
import { SharesCountContext } from '../components/store/SharesCountProvider';
import VendeeGlobePartial from '../components/partials/VendeeGlobePartial';
import HowItWorks from '../components/sections/HowItWorks';

const Index = ({ query }) => {
  const { totalShares } = useContext(SharesCountContext);

  const router = useRouter();

  useEffect(() => {
    // Fix because the site would'nt load right if there was a query param on the root page
    if (query) {
      router.replace('/');
    }
  }, []);

  return (
    <Layout>
      <LandingPagePartial />
      <Header isHome />
      <CandidatListPartial nbShares={totalShares} />
      <VendeeGlobePartial />
      <HowItWorks style="default" />
      <NumberPartial nbShares={totalShares} />
      <ActionPartial style="default" />
    </Layout>
  );
};

Index.propTypes = {
  query: PropTypes.shape(),
};

Index.defaultProps = {
  query: undefined,
};

Index.getInitialProps = ({ query }) => {
  return { query };
};

export default Index;
