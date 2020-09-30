import React from 'react';
import { Button, GridNoSSR, IconNoSSR, Section } from '../components/utils';
import { ContactPartial, SharePartial } from '../components/partials';
import { EXTERNAL_LINKS } from '../constants';
import Layout from '../components/Layout';
import HowItWorks from '../components/sections/HowItWorks';
import MultipleCTA from '../components/partials/MultipleCTA';
import ImageTitle from '../components/sections/ImageTitle';
import ModalInterestLinkedOut from '../components/modals/ModalInterestLinkedOut';
import { event } from '../lib/gtag';
import TAGS from '../constants/tags';

const Aider = () => (
  <Layout title="Aider - LinkedOut">
    <ImageTitle
      img="static/img/header_pic_help.jpg"
      alt="vous souhaitez aider"
      id="help-title"
      title={
        <>
          Vous souhaitez <span className="uk-text-primary">aider&nbsp;?</span>
        </>
      }
      text={"Il n'y a pas de petit coup de pouce, aidez à votre échelle\xa0!"}
    />
    <Section style="muted">
      <h2 className="uk-text-bold uk-text-center uk-margin-large-bottom">
        Vous êtes un <span className="uk-text-primary">particulier</span>
      </h2>
      <div className="uk-flex uk-flex-column uk-flex-middle uk-width-1-2@m uk-margin-auto">
        <h3 className="uk-text-bold uk-text-center">
          Partagez votre réseau avec ceux qui n’en n’ont plus&nbsp;!
        </h3>
        <hr className="uk-divider-small uk-margin-remove-vertical" />
        <div
          className="uk-text-center uk-flex-1 uk-margin-top uk-margin-bottom"
          style={{ padding: '0 30px' }}
        >
          Partager un CV sur vos réseaux donne une visibilité inédite à un
          candidat auprès de potentiels recruteurs et permet de générer des
          opportunités d’emploi. Votre partage peut tout changer&nbsp;!
        </div>
        <div className="uk-flex-center uk-flex uk-flex-middle">
          <Button href="/candidats" style="secondary">
            Partager un CV <IconNoSSR name="chevron-right" />
          </Button>
        </div>
      </div>
    </Section>
    <Section container="small">
      <MultipleCTA
        data={[
          {
            title: 'Coachez une personne exclue vers l’emploi\xa0!',
            text: (
              <div>
                Vous souhaitez donner de votre temps pour tisser une relation de
                proximité avec un candidat et le coacher dans son retour à
                l’emploi&nbsp;? Entourage vous forme à la mission de
                bénévole-coach et vous donne les outils.
              </div>
            ),
            button: {
              label: 'Devenir bénévole-coach',
              href: EXTERNAL_LINKS.ARTICLE_BC,
              external: true,
              onClick: () => event(TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC),
            },
          },
          {
            title: 'Faire un don',
            text: (
              <div>
                Vous souhaitez soutenir financièrement le projet LinkedOut et
                participer à la construction d’une société plus inclusive
              </div>
            ),
            button: {
              label: 'Faire un don',
              href: EXTERNAL_LINKS.DONATION,
              external: true,
              onClick: () => event(TAGS.PAGE_AIDER_DON_CLIC),
            },
          },
        ]}
        showHorizontalDividers
      />
    </Section>
    <HowItWorks style="default" />
    <Section style="muted">
      <GridNoSSR gap="large" column>
        <ContactPartial padding={false} />
        <SharePartial />
      </GridNoSSR>
    </Section>
    <ModalInterestLinkedOut />
  </Layout>
);

export default Aider;
