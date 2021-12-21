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
import SailInfoModal from 'src/components/modals/SailInfoModal';
import { openModal } from 'src/components/modals/Modal';

const Index = ({ query }) => {
  const router = useRouter();

  useMount(() => {
    // Fix because the site wouldn't load right if there was a query param on the root page
    if (query) {
      router.replace('/');
    }
    if (!process.env.HIDE_HOME_POPUP) {
      setTimeout(() => {
        openModal(<SailInfoModal />);
      }, 1500);
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
