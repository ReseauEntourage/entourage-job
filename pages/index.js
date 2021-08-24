import React from 'react';
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
import HowItWorks from '../components/sections/HowItWorks';
import AnnouncementPartial from '../components/partials/AnnouncementPartial';
import { useMount } from '../hooks/utils';

const Index = ({ query }) => {
  const router = useRouter();

  useMount(() => {
    // Fix because the site would'nt load right if there was a query param on the root page
    if (query) {
      router.replace('/');
    }
  });

  return (
    <Layout>
      <LandingPagePartial />
      <Header isHome />
      <CandidatListPartial />
      <AnnouncementPartial />
      <HowItWorks style="default" />
      <NumberPartial />
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
