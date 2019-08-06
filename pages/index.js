import React from 'react';
import {
  Button,
  PresentationCard,
  Grid,
  Section,
  Text,
} from '../components/utils';

const Index = () => (
  <div className="uk-cover-container">
    {/* style={{ backgroundImage: "url('/static/img/background.jpg')" }} */}
    <img
      src="/static/img/background.jpg"
      alt=""
      data-uk-cover
      style={{ opacity: 0.1, zIndex: -1 }}
    />
    <Section>
      <div data-uk-grid>
        <div className="uk-width-1-3">
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
        {/* <div className="uk-width-2-3" /> */}
      </div>
    </Section>
    <Section>
      <Grid
        match
        size="3"
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
    </Section>
    <Section>
      <div className="uk-flex uk-flex-center">
        <p>Découvrez les candidats</p>
      </div>
      <div className="uk-flex uk-flex-center">
        <a className="uk-icon-button" href="#candidat" data-uk-scroll>
          <span data-uk-icon="chevron-down" />
        </a>
      </div>
    </Section>
    <div id="candidat" />
  </div>
);

export default Index;
