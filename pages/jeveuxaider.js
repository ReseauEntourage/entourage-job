import React from 'react';
import {GridNoSSR, Section} from '../components/utils';
import {ContactPartial, SharePartial} from '../components/partials';
import {EXTERNAL_LINKS} from '../constants';
import Layout from '../components/Layout';
import HowItWorks from '../components/sections/HowItWorks';
import SimpleSection from "../components/sections/SimpleSection";
import MultipleCTA from "../components/partials/MultipleCTA";
import ImageTitle from "../components/sections/ImageTitle";
import SubHeader from "../components/sections/SubHeader";
import ModalInterestLinkedOut from "../components/modals/ModalInterestLinkedOut";


const JeVeuxAider = () => (
  <Layout title="Je veux aider - LinkedOut">
    <ImageTitle img='static/img/header_pic_help.jpg' id="help-title" title={<>Vous souhaitez <span className="uk-text-primary">aider&nbsp;?</span></>} text={"Il n'y a pas de petit coup de pouce, aidez à votre échelle\xa0!"} />
    <SubHeader id="profile" data={[
      {
        href: "#private",
        label: "Je suis un particulier"
      },
      {
        href: "#actor",
        label: "Je suis un acteur social ou associatif"
      },
      {
        href: "#give",
        label: "Je deviens mécène"
      },
    ]} style="muted"/>
    <Section container="small" style="default">
      {/* Fix so that the anchor scroll to the right height */}
      <div id="private" style={{marginTop: -140, paddingTop: 140}} />
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
        Je suis un{' '}
        <span className="uk-text-primary">particulier</span>
      </h2>
      <MultipleCTA
        data={[
          {
            title: "Partagez votre réseau pour donner une visibilité inédite à une personne exclue en recherche d’emploi",
            text: <div>Ouvrez votre réseau en partageant le CV d’un ou de plusieurs candidats LinkedOut. Votre partage permet de donner une visibilité inédite aux candidats auprès de potentiels recruteurs et de générer des opportunités d’emploi. Un partage peut tout changer&nbsp;!</div>,
            button: {
              label: "Je partage un CV",
              href: "/lescandidats"
            }
          },
          {
            title: "Coachez une personne exclue vers l’emploi\xa0!",
            text: <div>Vous souhaitez donner de votre temps pour tisser une relation de proximité avec un candidat et le coacher dans son retour à l’emploi&nbsp;? Entourage vous forme à la mission de bénévole-coach et vous donne les outils.</div>,
            button: {
              label: "Je deviens bénévole-coach",
              href: process.env.AIRTABLE_LINK_BECOME_COACH,
              external: true
            }
          }
        ]}
        showHorizontalDividers
      />
    </Section>
    <Section container="small" style="muted">
      {/* Fix so that the anchor scroll to the right height */}
      <div id="actor" style={{marginTop: -140, paddingTop: 140}} />
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
        Je suis un{' '}<span className="uk-text-primary">acteur de l&apos;insertion</span>
        {' '}sociale et professionnelle
      </h2>
      <MultipleCTA
        data={[
          {
            title: "Vous accompagnez une personne en démarche d'insertion professionnelle\xa0?",
            button: {
              label: "Je vous l'oriente",
              href: process.env.AIRTABLE_LINK_PROFESSIONAL_REINTEGRATION,
              external: true
            }
          },
          {
            title: "Vous êtes intéressé(e) par l’approche de LinkedOut et souhaitez coopérer avec nous\xa0?",
            button: {
              label: "Écrivez-nous",
              modal: "target: #modal-interest-linkedOut"
            }
          }
        ]}
        showVerticalDividers/>
    </Section>
    <SimpleSection
      title={
        <>
          Je deviens{' '}<span className="uk-text-primary">mécène</span>
        </>
      }
      text="Je souhaite soutenir financièrement le projet LinkedOut et participer à la construction d’une société plus inclusive"
      id="give"
      button={{
        label: "Je fais un don",
        href: EXTERNAL_LINKS.DONATION,
        external: true
      }} />
    <HowItWorks />
    <Section style='muted' className="uk-padding-remove-top">
      <GridNoSSR gap="large" column>
        <ContactPartial padding={false} />
        <SharePartial/>
      </GridNoSSR>
    </Section>
    <ModalInterestLinkedOut />
  </Layout>
);

export default JeVeuxAider;
