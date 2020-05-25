import React from 'react';
import {GridNoSSR, Section} from '../components/utils';
import {ContactPartial, SharePartial} from '../components/partials';
import {EXTERNAL_LINKS} from '../constants';
import Layout from '../components/Layout';
import HowItWorks from '../components/sections/HowItWorks';
import SimpleCTA from "../components/partials/SimpleCTA";
import MultipleCTA from "../components/partials/MultipleCTA";
import ImageTitle from "../components/sections/ImageTitle";
import SubHeader from "../components/sections/SubHeader";
import ModalInterestLinkedOut from "../components/modals/ModalInterestLinkedOut";


const JeVeuxAider = () => (
  <Layout title="Je veux aider - LinkedOut">
    <ImageTitle img='static/img/header_pic.jpg' id="help-title" title={<>Vous souhaitez <span className="uk-text-primary">aider&nbsp;?</span></>} text={"Il n'y a pas de petit coup de pouce, aidez à votre échelle\xa0!"} />
    <SubHeader id="profile" data={[
      {
        href: "#private",
        label: "Je suis un particulier"
      },
      {
        href: "#actor",
        label: "Je suis un acteur social"
      },
      {
        href: "#give",
        label: "Je deviens mécène"
      },
    ]} style="muted"/>
    <Section container="small" style="default">
      {/* Fix so that the anchor scroll to the right height */}
      <div id="private" style={{marginTop: -140, paddingTop: 140}} />
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-vertical">
        Je suis un{' '}
        <span className="uk-text-primary">particulier</span>
      </h2>
      <MultipleCTA
        data={[
          {
            title: "Donnez de la visibilité au candidat",
            text: "Ouvrez votre réseau en partageant le CV d’un ou de plusieurs candidats LinkedOut. Votre partage permet de donner une visibilité inédite aux candidats auprès de recruteurs et de générer des opportunités d’emploi.\nUn partage peut tout changer\xa0!",
            button: {
              label: "Je partage un CV",
              href: "/lescandidats"
            }
          },
          {
            title: "Engagez-vous avec un candidat LinkedOut",
            text: "Vous souhaitez donner de votre temps pour tisser une relation de confiance avec un candidat et le coacher vers le retour à l’emploi\xa0?\nEntourage vous forme à la mission de bénévole-coach et vous donne les outils\xa0!",
            button: {
              label: "Je deviens bénévole-coach",
              href: process.env.AIRTABLE_LINK_BECOME_COACH,
              external: true
            }
          }
        ]}
        showDividers
      />
    </Section>
    <Section container="small" style="muted">
      {/* Fix so that the anchor scroll to the right height */}
      <div id="actor" style={{marginTop: -140, paddingTop: 140}} />
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom">
        Je suis un{' '}<span className="uk-text-primary">acteur de l&apos;insertion</span>
        {' '}sociale et professionnelle
      </h2>
      <MultipleCTA
        data={[
          {
            title: "Vous accompagnez un personne en démarche de réinsertion professionnelle",
            button: {
              label: "Je vous l'oriente",
              href: process.env.AIRTABLE_LINK_PROFESSIONAL_REINTEGRATION,
              external: true
            }
          },
          {
            title: "Vous êtes intéressés par le projet LinkedOut et vous souhaiteriez coopérer avec nous",
            button: {
              label: "Écrivez-nous",
              href: "#",
              external: true,
              modal: "#modal-interest-linkedOut"
            }
          }
        ]}/>
    </Section>
    <SimpleCTA
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
        <ContactPartial padding="none" />
        <SharePartial/>
      </GridNoSSR>
    </Section>
    <ModalInterestLinkedOut />
  </Layout>
);

export default JeVeuxAider;
