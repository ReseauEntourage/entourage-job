import React from 'react';

import Layout from '../components/Layout';
import { ShareCandidatesCVTutorial } from '../components/partials';
import SearchCandidates from '../components/partials/SearchCandidates';

const Candidats = () => {
  return (
    <Layout title="Les candidats - LinkedOut">
      <ShareCandidatesCVTutorial />
      <SearchCandidates defaultHideEmployed />
    </Layout>
  );
};
export default Candidats;
