import React from 'react';
import Layout from '../../components/Layout';
import ImageTitle from '../../components/sections/ImageTitle';
import HireSteps from '../../components/sections/HireSteps';
import DiscoverCandidates from '../../components/partials/SearchCandidates';
import CorporateContact from '../../components/partials/CorporateContactPartial';
import CorporateNewsletter from '../../components/partials/CorporateNewsletterPartial';

const CVEntreprises = () => (
  <Layout title="CV Entreprises - LinkedOut">
    <ImageTitle
      img="/static/img/header_pic_hire.jpg"
      id="companies-title"
      title={
        <span>
          <span className="uk-text-primary">Comment recruter</span> un
          candidat&nbsp;?
        </span>
      }
    />
    <HireSteps />
    <DiscoverCandidates />
    <CorporateContact />
    <CorporateNewsletter />
  </Layout>
);

export default CVEntreprises;
