import React from 'react';
import {GridNoSSR, Section} from '../components/utils';
import {ContactPartial, DiscoverPartial, SharePartial} from '../components/partials';
import Layout from '../components/Layout';
import ProfilAidant from '../components/sections/ProfilAidant';
import HowTo from '../components/sections/HowTo';
import StepCard from '../components/cards/StepCard';
import SimpleCTA from "../components/sections/SimpleCTA";
import DoubleCTA from "../components/sections/DoubleCTA";

const JeVeuxAider = () => (
  <Layout title="Je veux aider - LinkedOut">
    <Section id="titre">
      <h1 className="uk-heading-medium@s uk-text-bold uk-text-center uk-align-center uk-width-3-4">
        Vous souhaitez <span className="uk-text-primary">aider ?</span>
      </h1>
      <p
        className="uk-text-lead@s uk-text-center uk-align-center uk-width-2-3 "
        style={{ fontWeight: '600' }}
      >
        Il n&apos;y a pas de petit coup de pouce, aidez à votre échelle !
      </p>
    </Section>
    <DoubleCTA
      id="private"
      title={
        <>
          Je suis un <span className="uk-text-primary">particulier</span>
        </>
      }
      data={[
        {
          title: "Donnez de la visibilité au candidat",
          text: "Donnez de la visibilité au candidat en lui faisant bénéficier de votre réseau via le partage de son CV (facebook, LinkedIn, twitter). Vous augmentez ainsi ses chances de recevoir des opportunités d’emploi.\nVotre partage peut tout changer !",
          button: {
            label: "Je partage un CV",
            href: "" // TODO
          }
        },
        {
          title: "Engagez-vous avec un candidat LinkedOut",
          text: "Donnez de votre temps et tissez une relation de confiance avec le candidat pour le soutenir jusqu’à son intégration durable dans l’entreprise.\nEntourage vous forme à la mission de bénévole-coach !",
          button: {
            label: "Je deviens bénévole coach",
            href: "" // TODO
          }
        }
      ]}
     />
    <SimpleCTA
      title={
        <>
          Je suis un <span className="uk-text-primary">acteur de l&apos;insertion</span> sociale et professionnelle
        </>
      }
      text="Vous accompagnez une personne en démarche de réinsertion professionnelle, motivée pour travailler ?"
      id="actor"
      button={{
        label: "Je vous l'oriente",
        href: "" // TODO
      }}
      style="muted"/>
    <SimpleCTA
      title={
        <>
          Je deviens{' '}<span className="uk-text-primary">mécène</span>
        </>
      }
      text="Je souhaite soutenir financièrement le projet LinkedOut et participer à la construction d’une société plus inclusive"
      id="give"
      button={{
        label: "Je fais un don",
        href: "https://don.entourage.social/?_ga=2.51486825.130511908.1589373822-697393147.1588101221"
      }} />
    <HowTo />
    <Section style='muted'>
      <GridNoSSR gap="large" column>
        <ContactPartial padding="none" submitLabel="Ok" title={
          <h4 className='uk-align-center uk-width-1-2@m'>Je m&apos;inscris à la newsletter pour avoir des nouvelles des candidats et être informé de l&apos;évolution du projet.</h4>
        }/>
        <SharePartial/>
      </GridNoSSR>
    </Section>
  </Layout>
);

export default JeVeuxAider;
