import React from 'react';
import Layout from '../../components/Layout';
import ImageTitle from '../../components/sections/ImageTitle';
import HireSteps from '../../components/sections/HireSteps';
import DiscoverCandidates from '../../components/partials/SearchCandidates';
import CorporateContact from '../../components/partials/CorporateContactPartial';

const CVEntreprises = () => (
  <Layout title="CV Entreprises - LinkedOut">
    <ImageTitle
      img="/static/img/header_pic_hire.jpg"
      id="companies-title"
      title={
        <span>
          <div>Concrètement,</div>
          <span className="uk-text-primary">comment recruter</span> un
          candidat&nbsp;?
        </span>
      }
      text={"Il n'y a pas de petit coup de pouce, aidez à votre échelle\xa0!"}
    />
    <HireSteps />
    <DiscoverCandidates />
    <CorporateContact />
  </Layout>
);

export default CVEntreprises;
