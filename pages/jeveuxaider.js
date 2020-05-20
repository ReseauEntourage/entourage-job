import React from 'react';
import {GridNoSSR, Section} from '../components/utils';
import {ContactPartial, SharePartial} from '../components/partials';
import {EXTERNAL_LINKS} from '../constants';
import Layout from '../components/Layout';
import HowItWorks from '../components/sections/HowItWorks';
import SimpleCTA from "../components/sections/SimpleCTA";
import MultipleCTA from "../components/sections/MultipleCTA";
import ImageTitle from "../components/sections/ImageTitle";
import SubHeader from "../components/sections/SubHeader";

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
        href: process.env.AIRTABLE_LINK_JOIN_LINKEDOUT,
        external: true
      }}
      style="muted"/>
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
    <Section style='muted'>
      <GridNoSSR gap="large" column>
        <ContactPartial padding="none" submitLabel="OK" title={
          <h3 className='uk-align-center uk-text-bold uk-width-1-2@m'>Je m&apos;inscris à la newsletter pour avoir des nouvelles des candidats et être informé de l&apos;évolution du projet.</h3>
        }/>
        <SharePartial/>
      </GridNoSSR>
    </Section>
  </Layout>
);

export default JeVeuxAider;
