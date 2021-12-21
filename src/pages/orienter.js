import React from 'react';
import Partners from 'src/components/partials/Partners';
import CandidateTestimoniesOrientation from 'src/components/partials/CandidateTestimoniesOrientation';
import { CONTACT_INFO } from 'src/constants';
import WhoFor from 'src/components/partials/WhoFor';
import WhatItBringsToCandidates from 'src/components/partials/WhatItBringsToCandidates';
import Layout from 'src/components/Layout';
import { Section, SimpleLink } from 'src/components/utils';
import SimpleSection from 'src/components/partials/SimpleSection';
import Button from 'src/components/utils/Button';
import ImageTitle from 'src/components/partials/ImageTitle';
import { IconNoSSR } from 'src/components/utils/Icon';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';

const steps = [
  {
    text: "Participez à un webinaire d'information LinkedOut pour confirmer la pertinence du dispositif LinkedOut pour la personne que vous souhaitez orienter",
    button: {
      label: 'Je participe au webinaire de présentation',
      href: `${process.env.WEBINAR_URL}`,
      external: true,
      newTab: true,
      tag: TAGS.PAGE_ORIENTER_WEBINAIRE_CLIC,
    },
  },
  {
    text: 'Pré-inscrivez votre candidat ci-dessous',
    button: {
      label: 'Pré-inscrire un candidat',
      href: `${process.env.AIRTABLE_LINK_PROFESSIONAL_REINTEGRATION}`,
      external: true,
      newTab: true,
      tag: TAGS.PAGE_ORIENTER_INSCRIPTION_CLIC,
    },
  },
];

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
            onClick={() => {
              event(TAGS.PAGE_ORIENTER_WEBINAIRE_CLIC);
            }}
            uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;"
            className="uk-margin-medium-top"
            href={process.env.WEBINAR_URL}
            style="secondary"
            isExternal
            newTab
          >
            Je souhaite orienter un candidat&nbsp;: je m&apos;inscris au
            webinaire d&apos;info&nbsp;!
            <IconNoSSR name="chevron-right" />
          </Button>
        </div>
      </Section>
      <WhatItBringsToCandidates />
      <WhoFor />
      <SimpleSection
        style="default"
        container="small"
        id="orientationCandidate"
        title={
          <>
            Vous souhaitez orienter un candidat&nbsp;?{' '}
            <span className="uk-text-primary">Comment faire&nbsp;?</span>
          </>
        }
        fontSize="small"
        text={
          <>
            <div>
              Nous accompagnons plusieurs promotions par an à Paris, dans le 92
              et le 93, à Lille et Lyon.
              <br />
              <br />
              <span className="uk-text-bold">
                Vous accompagnez une personne qui répond aux critères ci-dessus,
                motivée pour travailler et disponible pour participer au
                programme&nbsp;?
              </span>
            </div>
          </>
        }
      >
        <div>
          {steps.map((step, index, array) => {
            return (
              <div key={index}>
                <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-padding">
                  <div className="uk-flex uk-flex-middle uk-flex-center">
                    <div
                      className="uk-flex uk-flex-top uk-text-bold uk-text-primary uk-text-large uk-margin-small-right uk-text-nowrap"
                      style={{ fontSize: 36, lineHeight: 1 }}
                    >
                      {index + 1}.
                    </div>
                    <p className="uk-text-bold uk-margin-remove">{step.text}</p>
                  </div>
                  <Button
                    className="uk-margin-medium-top"
                    href={step.button.href}
                    style="secondary"
                    isExternal={step.button.external}
                    newTab={step.button.external}
                    onClick={() => {
                      event(step.button.tag);
                    }}
                  >
                    {step.button.label}
                    &nbsp;
                    <IconNoSSR name="chevron-right" />
                  </Button>
                </div>
                {index < array.length - 1 && <hr />}
              </div>
            );
          })}
        </div>
        <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-large-top">
          <span className="uk-text-center">
            Les candidats inscrits disposant des pré-requis nécessaires pour
            intégrer LinkedOut seront conviés à une{' '}
            <span className="uk-text-bold">
              session d’information collective
            </span>{' '}
            en amont du lancement de la promotion puis à un{' '}
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
      <CandidateTestimoniesOrientation style="muted" />
      <Partners showOrientationPartners />
    </Layout>
  );
};

export default Orienter;
