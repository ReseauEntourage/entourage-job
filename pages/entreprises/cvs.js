import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import ImageTitle from '../../components/sections/ImageTitle';
import HireSteps from '../../components/sections/HireSteps';
import SearchCandidates from '../../components/partials/SearchCandidates';
import CorporateContact from '../../components/partials/CorporateContactPartial';
import CorporateNewsletter from '../../components/partials/CorporateNewsletterPartial';
import { Section } from '../../components/utils';

const CVEntreprises = () => {
  return (
    <Layout title="CVs Entreprises - LinkedOut">
      <ImageTitle
        img="/static/img/header_pic_hire.jpg"
        id="companies-title"
        title={
          <span>
            <span className="uk-text-primary">Je recrute</span>{' '}
            <span>un candidat</span>
          </span>
        }
      />
      <SearchCandidates style="muted" defaultHideEmployed />
      <HireSteps />
      <CorporateContact />
      <CorporateNewsletter style="muted" />
    </Layout>
  );
};

export default CVEntreprises;
