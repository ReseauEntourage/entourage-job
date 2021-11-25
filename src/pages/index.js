import React from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Layout from 'src/components/Layout';

import {
  ActionPartial,
  CandidatListPartial,
  LandingPagePartial,
  NumberPartial,
} from 'src/components/partials';

import Header from 'src/components/headers/Header';
import HowItWorks from 'src/components/partials/HowItWorks';
import AnnouncementPartial from 'src/components/partials/AnnouncementPartial';
import { useMount } from 'src/hooks/utils';
import LinkedInPartial from 'src/components/partials/LinkedInPartial';

const Index = ({ query }) => {
  const router = useRouter();

  useMount(() => {
    // Fix because the site would'nt load right if there was a query param on the root page
    if (query) {
      router.replace('/');
    }
    setTimeout(() => {
      UIkit.modal(`#modal-sail-info`).show();
    }, 1000);
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
      <LinkedInPartial />
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
