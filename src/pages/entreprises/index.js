import React from 'react';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';
import ModalInterestLinkedOut from 'src/components/modals/ModalInterestLinkedOut';
import Img from 'src/components/utils/Img';
import LogoList from 'src/components/partials/LogoList';
import WhatItBringsToCompanies from 'src/components/sections/WhatItBringsToCompanies';
import Layout from 'src/components/Layout';
import { Button, GridNoSSR, Section } from 'src/components/utils';
import ImageTitle from 'src/components/sections/ImageTitle';
import HireCTA from 'src/components/partials/HireCTA';
import Reviews from 'src/components/sections/Reviews';
import HowToCommitDifferently from 'src/components/sections/HowToCommitDifferently';
import CorporateNewsletter from 'src/components/partials/CorporateNewsletterPartial';
import PARTNERS from 'src/constants/partners';
import { addPrefix } from 'src/utils';

const Entreprises = () => {
  const content = (
    <div className="uk-flex uk-flex-column uk-flex-middle uk-flex-center">
      <div className="uk-light uk-flex uk-flex-column uk-flex-middle">
        <h2 className="uk-text-bold uk-text-center uk-margin-bottom uk-margin-remove-top">
          Une nouvelle promotion arrive à l&apos;automne 2021&nbsp;!
        </h2>
        <h3
          className="uk-text-center uk-margin-remove-top"
          style={{ color: 'white' }}
        >
          Plus de 160 candidats s&apos;apprêtent à se lancer dans la recherche
          d&apos;une nouvelle expérience professionnelle&nbsp;!
          <br />
          Laissez-nous votre contact pour être tenus informés.
        </h3>
      </div>
      <GridNoSSR middle column gap="collapse">
        <Button
          style="secondary"
          toggle="target: #modal-interest-linkedOut"
          onClick={() => {
            return event(TAGS.PAGE_AIDER_CONTACT_RECRUTEUR_CLIC);
          }}
        >
          Nous contacter
        </Button>
      </GridNoSSR>
      <ModalInterestLinkedOut />
    </div>
  );

  return (
    <Layout title="Entreprises - LinkedOut">
      <ImageTitle
        img="static/img/header_pic_hire.jpg"
        id="hire-title"
        title={
          <>
            Entreprises,
            <br />
            <span className="uk-text-primary">recrutez avec LinkedOut</span>
          </>
        }
      />
      <Section id="makeADifference" style="muted" container="small">
        <h4 className="uk-align-center uk-text-center">
          Bienvenue chez LinkedOut. Ici, vous pouvez concilier vos besoins de
          recrutement et{' '}
          <span className="uk-text-bold">
            votre engagement pour l’inclusion
          </span>
          &nbsp;! Les candidats LinkedOut ont des histoires de vie difficiles.
          Ils ont tous un point commun&nbsp;:{' '}
          <span className="uk-text-bold">la capacité à travailler</span> et{' '}
          <span className="uk-text-bold">l’envie de s’en sortir</span>.<br />
          Vous pouvez <span className="uk-text-bold">changer leur vie</span> en
          les recrutant&nbsp;: alors qu’attendez-vous&nbsp;? L&apos;équipe
          LinkedOut{' '}
          <span className="uk-text-bold">
            vous accompagne à toutes les étapes.
          </span>
        </h4>
      </Section>
      <HireCTA />
      <WhatItBringsToCompanies />
      <Section container="small" style="default">
        <div className="uk-inline uk-visible@m">
          <Img
            width="1500"
            height="1000"
            src="/static/img/candidats.jpg"
            alt="Visages LinkedOut"
          />
          <div
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            className="uk-position-cover"
          />
          <div className="uk-overlay uk-position-center uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding-large">
            {content}
          </div>
        </div>
        <div
          className="uk-hidden@m uk-flex uk-flex-column uk-flex-middle uk-padding-small uk-background-center-center uk-background-cover uk-background-blend-overlay"
          style={{
            backgroundImage: `url(${addPrefix('/static/img/candidats.jpg')})`,
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}
        >
          {content}
        </div>
      </Section>
      <Section style="muted">
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
