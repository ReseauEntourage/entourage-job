import React from 'react';

import Layout from 'src/components/Layout';
import { ShareCandidatesCVTutorial } from 'src/components/partials';
import SearchCandidates from 'src/components/partials/SearchCandidates';

const Candidats = () => {
  return (
    <Layout title="Les candidats - LinkedOut">
      <SearchCandidates defaultHideEmployed />
      <ShareCandidatesCVTutorial />
    </Layout>
  );
};
export default Candidats;
