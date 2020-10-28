import React from 'react';
import Layout from '../../components/Layout';
import { Section } from '../../components/utils';
import ImageTitle from '../../components/sections/ImageTitle';
import WhatItBrings from '../../components/sections/WhatItBrings';
import HireCTA from '../../components/partials/HireCTA';
import Reviews from '../../components/sections/Reviews';
import HowToCommitDifferently from '../../components/sections/HowToCommitDifferently';
import CorporateNewsletter from '../../components/partials/CorporateNewsletterPartial';

const Entreprises = () => {
  return (
    <Layout title="Entreprises - LinkedOut">
      <ImageTitle
        img="static/img/header_pic_hire.jpg"
        id="hire-title"
        title={
          <>
            Entreprises,{' '}
            <span className="uk-text-primary">engagez-vous avec LinkedOut</span>
          </>
        }
      />
      <Section id="makeADifference" style="muted" container="small">
        <h4 className="uk-align-center uk-text-center">
          Soyez des acteurs essentiels d’une société qui donne sa place aux plus
          précaires. Recrutez un candidat, ou découvrez plus bas d’autres
          manières de vous engager.
        </h4>
        <WhatItBrings />
      </Section>
      <HireCTA />
      <Reviews />
      <HowToCommitDifferently />
      <CorporateNewsletter />
    </Layout>
  );
};

export default Entreprises;
