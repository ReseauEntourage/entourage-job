import React from 'react';
import {GridNoSSR, Section} from '../components/utils';
import {ContactPartial, DiscoverPartial, SharePartial} from '../components/partials';
import Layout from '../components/Layout';
import ProfilAidant from '../components/sections/ProfilAidant';
import HowTo from '../components/sections/HowTo';
import StepCard from '../components/cards/StepCard';
import SimpleCTA from "../components/sections/SimpleCTA";
import MultipleCTA from "../components/sections/MultipleCTA";
import ImageTitle from "../components/sections/ImageTitle";

const JeVeuxAider = () => (
  <Layout title="Je veux aider - LinkedOut">
    <ImageTitle id="help-title" title={<>Vous souhaitez <span className="uk-text-primary">aider ?</span></>} text="Il n'y a pas de petit coup de pouce, aidez à votre échelle !" />
    <Section id="profile" style="muted">
      <div className="uk-flex uk-flex-wrap uk-flex-around">
        <a href="#private"><h3 className="uk-text-primary">Je suis un particulier</h3></a>
        <a href="#actor"><h3 className="uk-text-primary">Je suis un acteur social</h3></a>
        <a href="#give"><h3 className="uk-text-primary">Je deviens mécène</h3></a>
      </div>
    </Section>
    <MultipleCTA
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
            href: "/lescandidats"
          }
        },
        {
          title: "Engagez-vous avec un candidat LinkedOut",
          text: "Donnez de votre temps et tissez une relation de confiance avec le candidat pour le soutenir jusqu’à son intégration durable dans l’entreprise.\nEntourage vous forme à la mission de bénévole-coach !",
          button: {
            label: "Je deviens bénévole coach",
            href: "https://airtable.com/shrZg9tgkviDwPVoW", // TODO MAKE CONSTANT
            external: true
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
        href: "https://airtable.com/shr63tyc9rBdJO2ko", // TODO MAKE CONSTANT
        external: true
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
        href: "https://don.entourage.social/?_ga=2.51486825.130511908.1589373822-697393147.1588101221",
        external: true
      }} />
    <HowTo />
    <Section style='muted'>
      <GridNoSSR gap="large" column>
        <ContactPartial padding="none" submitLabel="Ok" title={
          <h3 className='uk-align-center uk-width-1-2@m'>Je m&apos;inscris à la newsletter pour avoir des nouvelles des candidats et être informé de l&apos;évolution du projet.</h3>
        }/>
        <SharePartial/>
      </GridNoSSR>
    </Section>
  </Layout>
);

export default JeVeuxAider;
