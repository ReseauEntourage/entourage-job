import React from 'react';
import Layout from '../../components/Layout';
import ImageTitle from '../../components/sections/ImageTitle';
import HireSteps from '../../components/sections/HireSteps';
import SearchCandidates from '../../components/partials/SearchCandidates';
import CorporateContact from '../../components/partials/CorporateContactPartial';
import CorporateNewsletter from '../../components/partials/CorporateNewsletterPartial';
import { Section } from '../../components/utils';
import Link from 'next/link';

const CVEntreprises = () => (
  <Layout title="CVs Entreprises - LinkedOut">
    <ImageTitle
      img="/static/img/header_pic_hire.jpg"
      id="companies-title"
      title={
        <span>
          <span className="uk-text-primary">Comment recruter</span>{' '}
          <span>un candidat&nbsp;?</span>
        </span>
      }
    />
    <HireSteps />
    <SearchCandidates />
    <Section style="default">
      <h4 className="uk-text-bold uk-text-center">
        Vous ne trouvez pas de candidat ?&nbsp;
        <Link href="/entreprises#sengager">
          <a style={{ textDecoration: 'underline' }}>Agissez autrement</a>
        </Link>
      </h4>
    </Section>
    <CorporateContact />
    <CorporateNewsletter />
  </Layout>
);

export default CVEntreprises;
