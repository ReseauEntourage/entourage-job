import React from 'react';
import {GridNoSSR, Section} from '../components/utils';
import {ContactPartial, SharePartial} from '../components/partials';
import {EXTERNAL_LINKS} from '../constants';
import Layout from '../components/Layout';
import HowItWorks from '../components/sections/HowItWorks';
import SimpleSection from "../components/sections/SimpleSection";
import MultipleCTA from "../components/partials/MultipleCTA";
import ImageTitle from "../components/sections/ImageTitle";
import ModalInterestLinkedOut from "../components/modals/ModalInterestLinkedOut";


const Aider = () => (
  <Layout title="Aider - LinkedOut">
    <ImageTitle img='static/img/header_pic_help.jpg' id="help-title" title={<>Vous souhaitez <span className="uk-text-primary">aider&nbsp;?</span></>} text={"Il n'y a pas de petit coup de pouce, aidez à votre échelle\xa0!"} />
    <Section style='muted' className="uk-padding-remove-bottom">
      <ul className="uk-flex-nowrap uk-overflow-auto" data-uk-tab=".uk-switcher">
        <li className="uk-flex uk-flex-middle uk-flex-center"><a href="#"><h4 className="uk-text-bold">Vous êtes un particulier</h4></a></li>
        <li className="uk-flex uk-flex-middle uk-flex-center"><a href="#"><h4 className="uk-text-bold">Vous êtes un acteur social ou associatif</h4></a></li>
        <li className="uk-flex uk-flex-middle uk-flex-center"><a href="#"><h4 className="uk-text-bold">Vous êtes une entreprise</h4></a></li>
        <li className="uk-flex uk-flex-middle uk-flex-center"><a href="#"><h4 className="uk-text-bold">Devenez mécène</h4></a></li>
      </ul>
    </Section>
    <ul className="uk-switcher uk-flex uk-flex-center uk-background-muted">
        <li className="uk-flex">
          <Section style="muted" container='small'>
            <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
              Vous êtes un{' '}
              <span className="uk-text-primary">particulier</span>
            </h2>
            <MultipleCTA
              data={[
                {
                  title: "Partagez votre réseau avec ceux qui n’en n’ont plus\xa0!",
                  text: <div>Partager un CV sur vos réseaux donne une visibilité inédite à un candidat auprès de potentiels recruteurs et permet de générer des opportunités d’emploi. Votre partage peut tout changer&nbsp;!</div>,
                  button: {
                    label: "Partager un CV",
                    href: "/candidats"
                  }
                },
                {
                  title: "Coachez une personne exclue vers l’emploi\xa0!",
                  text: <div>Vous souhaitez donner de votre temps pour tisser une relation de proximité avec un candidat et le coacher dans son retour à l’emploi&nbsp;? Entourage vous forme à la mission de bénévole-coach et vous donne les outils.</div>,
                  button: {
                    label: "Devenir bénévole-coach",
                    href: process.env.AIRTABLE_LINK_BECOME_COACH,
                    external: true
                  }
                }
              ]}
              showHorizontalDividers
            />
          </Section>
        </li>
        <li className="uk-flex">
          <Section style="muted" container='small'>
            <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
              Vous êtes un{' '}<span className="uk-text-primary">acteur de l&apos;insertion</span>
              {' '}sociale et professionnelle
            </h2>
            <MultipleCTA
              spacing='medium'
              data={[
                {
                  title: "Vous accompagnez une personne en démarche d'insertion professionnelle\xa0?",
                  button: {
                    label: "Nous l'orienter",
                    href: process.env.AIRTABLE_LINK_PROFESSIONAL_REINTEGRATION,
                    external: true
                  }
                },
                {
                  title: "Vous souhaitez coopérer avec LinkedOut\xa0?",
                  button: {
                    label: "Nous écrire",
                    modal: "target: #modal-interest-linkedOut"
                  }
                }
              ]}
              showVerticalDividers/>
          </Section>
        </li>
        <li className="uk-flex">
          <SimpleSection
            style="muted"
            title={
              <>
                Vous êtes une{' '}<span className="uk-text-primary">entreprise</span>
              </>
            }
            text="Votre entreprise peut aussi jouer un rôle ! Que vous soyez une TPE, une grande entreprise ou une start-up, nous vous proposons différents moyens de vous engager"
            id="entreprise"
            button={{
              label: "Nous écrire",
              modal: "target: #modal-interest-linkedOut"
            }} />
        </li>
        <li className="uk-flex">
          <SimpleSection
            title={
              <>
                Devenez{' '}<span className="uk-text-primary">mécène</span>
              </>
            }
            text="Vous souhaitez soutenir financièrement le projet LinkedOut et participer à la construction d’une société plus inclusive"
            id="mécène"
            style="muted"
            button={{
              label: "Faire un don",
              href: EXTERNAL_LINKS.DONATION,
              external: true
            }} />
        </li>

      </ul>
    <HowItWorks style='default' />
    <Section style='muted'>
      <GridNoSSR gap="large" column>
        <ContactPartial padding={false} />
        <SharePartial/>
      </GridNoSSR>
    </Section>
    <ModalInterestLinkedOut />
  </Layout>
);

export default Aider;
