import React from 'react';

import Layout from 'src/components/Layout';
import { ShareCandidatesCVTutorial } from 'src/components/partials';
import SearchCandidates from 'src/components/partials/SearchCandidates';
import CandidateTestimoniesOrientation from 'src/components/partials/CandidateTestimoniesOrientation';

const Candidats = () => {
  return (
    <Layout title="Les candidats - LinkedOut">
      <SearchCandidates />
      <ShareCandidatesCVTutorial />
      <CandidateTestimoniesOrientation style="default" />
    </Layout>
  );
};
export default Candidats;
