/* global UIkit */

import React from 'react';
import Partners from '../components/partials/Partners';
import CandidateTestimoniesOrientation from '../components/sections/CandidateTestimoniesOrientation';
import { CONTACT_INFO } from '../constants';
import WhoFor from '../components/sections/WhoFor';
import WhatItBringsToCandidates from '../components/sections/WhatItBringsToCandidates';
import Layout from '../components/Layout';
import { IconNoSSR, Section, SimpleLink } from '../components/utils';
import SimpleSection from '../components/sections/SimpleSection';
import Button from '../components/utils/Button';
import ImageTitle from '../components/sections/ImageTitle';

const Orienter = () => {
  return (
    <Layout title="Orienter - LinkedOut">
      <ImageTitle
        img="static/img/header_pic_guide.jpg"
        id="guide-title"
        title={
          <>
            Orientez-nous <br />
            <span className="uk-text-primary">des candidats&nbsp;!</span>
          </>
        }
      />
      <Section id="introLinkedout" container="small" style="muted">
        <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <h4
            className="uk-align-center uk-text-center"
            uk-scrollspy="cls:uk-animation-slide-bottom; target: > span; delay: 200;"
          >
            <span>
              LinkedOut est un dispositif de l’association Entourage qui vise à{' '}
              <span className="uk-text-bold">
                favoriser la réinsertion professionnelle
              </span>{' '}
              durable des personnes en situation de précarité,{' '}
              <span className="uk-text-bold">via la force du réseau</span>.
            </span>
            <br />
            <br />
            <span>
              Nous proposons un{' '}
              <span className="uk-text-bold uk-text-primary">
                tremplin vers l’emploi de 6 mois.
              </span>{' '}
              Ce parcours s’inscrit dans la continuité de l’accompagnement
              socio-professionnel réalisé en amont par les associations et
              structures d’insertion.
            </span>
            <br />
            <br />
            <span>
              Nous mobilisons les entreprises pour qu’elles{' '}
              <span className="uk-text-bold">
                proposent directement des offres aux candidats
              </span>{' '}
              et les accompagnons dans leur démarche de recrutement plus
              inclusif. Déjà 183 entreprises engagées&nbsp;!
            </span>
          </h4>
          <Button
            uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;"
            className="uk-margin-medium-top"
            href={process.env.AIRTABLE_LINK_PROFESSIONAL_REINTEGRATION}
            style="secondary"
            isExternal
            newTab
          >
            Promo #3 spéciale jeunes&nbsp;: orienter un candidat{' '}
            <IconNoSSR name="chevron-right" />
          </Button>
        </div>
      </Section>
      <WhatItBringsToCandidates />
      <WhoFor />
      <SimpleSection
        style="default"
        container="small"
        title={
          <>
            Prochaines <span className="uk-text-primary">inscriptions</span>
          </>
        }
        fontSize="small"
        text={
          <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
            Nous lançons une prochaine promotion en mai 2021{' '}
            <span className="uk-text-bold">
              dédiées aux jeunes (18 à 25 ans issus de l&apos;Aide Sociale à
              l&apos;Enfance ou en situation de précarite) résidants dans le 75,
              93 et 92.
            </span>
            Cette promotion se lance en collaboration avec Repair 75 spécialisée
            dans l’accompagnement des jeunes issus de l’ASE.
            <br />
            <br />
            <span className="uk-text-bold">
              Vous accompagnez un jeune qui rentre dans ces critères, motivé
              pour travailler et disponible pour participer au programme&nbsp;?
            </span>
          </div>
        }
        button={{
          label: ' Orienter un candidat',
          href: `${process.env.AIRTABLE_LINK_PROFESSIONAL_REINTEGRATION}`,
          external: true,
          newTab: true,
        }}
        id="nextPromotion"
      >
        <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-large-top">
          <span className="uk-text-center">
            Les candidats inscrits disposant des pré-requis nécessaires pour
            intégrer LinkedOut seront conviés à une{' '}
            <span className="uk-text-bold">
              session d’information collective
            </span>{' '}
            en avril 2021 puis à un{' '}
            <span className="uk-text-bold">
              entretien individuel obligatoire pour valider leur entrée dans le
              dispositif.
            </span>
          </span>
          <p className="uk-text-center">
            Une question&nbsp;?
            <br />
            <SimpleLink
              isExternal
              className="uk-link-text uk-text-primary"
              target="_blank"
              rel="noopener"
              href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
            >
              {process.env.MAILJET_CONTACT_EMAIL}
            </SimpleLink>
            <br />
            <SimpleLink
              isExternal
              className="uk-link-text uk-text-primary"
              target="_blank"
              rel="noopener"
              href={`tel:${CONTACT_INFO.MOBILE_PHONE_NUMBER}`}
            >
              {CONTACT_INFO.MOBILE_PHONE_NUMBER}
            </SimpleLink>
          </p>
        </div>
      </SimpleSection>
      <CandidateTestimoniesOrientation />
      <Partners showOrientationPartners />
    </Layout>
  );
};

export default Orienter;
