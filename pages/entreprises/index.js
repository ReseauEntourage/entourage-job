import React from 'react';
import LogoList from '../../components/partials/LogoList';
import WhatItBringsToCompanies from '../../components/sections/WhatItBringsToCompanies';
import Layout from '../../components/Layout';
import { Section } from '../../components/utils';
import ImageTitle from '../../components/sections/ImageTitle';
import HireCTA from '../../components/partials/HireCTA';
import Reviews from '../../components/sections/Reviews';
import HowToCommitDifferently from '../../components/sections/HowToCommitDifferently';
import CorporateNewsletter from '../../components/partials/CorporateNewsletterPartial';
import PARTNERS from '../../constants/partners';

const Entreprises = () => {
  return (
    <Layout title="Entreprises - LinkedOut">
      <ImageTitle
        img="static/img/header_pic_hire.jpg"
        id="hire-title"
        title={
          <>
            Entreprises,{' '}
            <span className="uk-text-primary">recrutez avec LinkedOut</span>
          </>
        }
      />
      <Section id="makeADifference" style="muted" container="small">
        <h4 className="uk-align-center uk-text-center">
          Bienvenue chez LinkedOut. Ici, vous pouvez vous{' '}
          <span className="uk-text-bold">engager pour l&apos;inclusion</span> et
          aider simplement et concrètement les jeunes du programme à retrouver
          un emploi. Ils sont prêts et n&apos;attendent plus que vous. Alors...{' '}
          <span className="uk-text-bold">
            Prêts à balancer votre offre&nbsp;?
          </span>
        </h4>
      </Section>
      <HireCTA />
      <WhatItBringsToCompanies />
      <Section>
        <h2 className="uk-text-center uk-text-bold">
          Ils ont <span className="uk-text-primary">déjà recruté</span>
        </h2>
        <LogoList logos={PARTNERS.hired} />
      </Section>
      <Reviews />
      <HowToCommitDifferently />
      <CorporateNewsletter />
    </Layout>
  );
};

export default Entreprises;
