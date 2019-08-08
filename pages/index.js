import React from 'react';
import {
  Button,
  PresentationCard,
  CandidatCard,
  Grid,
  Section,
  Background,
} from '../components/utils';

const Index = () => (
  <div className="uk-cover-container">
    <Background
      src="/static/img/background.jpg"
      position="top-center"
      blend={{ colorHex: '#999', mode: 'screen' }}
    >
      <Section>
        <div data-uk-grid>
          <div className="uk-width-1-1">
            <img
              className="uk-width-medium"
              src="/static/img/linkedout_by_entourage.png"
              alt="linkedout by Entourage"
            />
            <h1 className="uk-heading- uk-text-bold uk-margin-large">
              <span>Partagez votre </span>
              <span className="uk-text-primary">réseau</span>
              <span> avec ceux qui n&apos;en ont pas</span>
            </h1>
            <Button href="#" size="" style="primary">
              partager l&apos;opération
            </Button>
          </div>
        </div>
        <Grid
          match
          center
          childWidths={['1-3@s', '1-2']}
          items={[
            <PresentationCard
              imgSrc="/static/img/illustrations/helping_process.png"
              imgAlt="profiles"
              text="1. Découvrez les profils des candidats"
            />,
            <PresentationCard
              imgSrc="/static/img/illustrations/flyer_sharing.png"
              imgAlt="partage"
              text="2. Partagez leurs cv, ouvrez leur votre réseau"
            />,
            <PresentationCard
              imgSrc="/static/img/illustrations/friendship.png"
              imgAlt="échange"
              text="3. Permettez leur de trouver un travail"
            />,
          ]}
        />
        <div className="uk-flex uk-flex-center uk-padding-large uk-padding-remove-bottom">
          <p>Découvrez les candidats</p>
        </div>
        <div className="uk-flex uk-flex-center">
          <a className="uk-icon-button" href="#profiles" data-uk-scroll>
            <span data-uk-icon="chevron-down" />
          </a>
        </div>
      </Section>
    </Background>
    <Section style="secondary" size="large" id="candidat">
      <p className="uk-text-lead">
        Lorsqu&apos;on est désocialisé, on devient invisible. <br /> Les chance
        de retrouver du travail sont très faibles.
      </p>
      <p className="uk-text-lead">
        L&apos;association Entourage vous propose de faire un don de visibilité.
        <br />
        <span className="uk-text-primary">Un partage</span> peut tout changer.
      </p>
    </Section>
    <Section style="default" id="profiles">
      <div className="uk-text-center">
        <h3 className="uk-heading-small">
          <span className="uk-text-primary">Eux</span> cherchent un travail,
          <br />
          <span className="uk-text-primary">Vous</span> avez un réseau.
        </h3>
        <p>
          Nos candidats sont des gens en situation de précarité financière et
          professionnellle. Toutes accompagnées par des travailleurs sociaux,
          motivées pour se réinsérer, elles dévoilent leurs talents et leurs
          aspirations. Réseau, amis, recruteurs, à vos partages!
        </p>
      </div>
      <Grid
        childWidths={['1-1', '1-2@s', '1-3@m']}
        parallax="500"
        items={Array(12).fill([
          <CandidatCard
            imgSrc="static/img/arthur.png"
            imgAlt="arthur"
            title="Arthur"
            description="série télévisée d'animation américano-canadienne, basée sur
            Les Aventures d'Arthur de Marc Brown et diffusée depuis le
            7 octobre 1996 sur le réseau PBS."
            goods={['volontaire', "esprit d'équipe"]}
            ambitions={['la vente', 'la restauration']}
          />,
        ])}
      />
      <div className="uk-with-1-1 uk-text-center uk-padding uk-padding-remove-bottom">
        <Button style="default">Voir plus</Button>
      </div>
    </Section>
  </div>
);

export default Index;
