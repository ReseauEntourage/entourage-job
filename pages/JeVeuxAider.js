import React from 'react';

import {
  HelpingCard,
  ScaleCard,
  Button,
  Section,
  Grid,
  Slider,
} from '../components/utils';
import { DiscovertPartial, EmphasePartial } from '../components/partials';

const JeVeuxAider = () => (
  <div>
    <Section id="help" style="default">
      <h1 className="uk-text-center">
        Vous souhaitez <span className="uk-text-primary">aider</span> ?
      </h1>
      <Slider
        childWidths={['1-1', '1-3@m']}
        auto
        grid="small"
        items={[
          <HelpingCard
            titleHead="Vous connaissez une personne en difficulté ? "
            titleMiddle="Entourage vous accompagne"
            titleTail=" dans les démarches"
            description="Vous n'êtes pas seul! Entourage vous donne les outils pour soutenir efficacement une personne danssa recherche professionnelle et dans sa prise de poste"
            img="/static/img/help_1.png"
          />,
          <HelpingCard
            titleHead="Vous connaissez une personne en difficulté ? "
            titleMiddle="Entourage vous accompagne"
            titleTail=" dans les démarches"
            description="Vous n'êtes pas seul! Entourage vous donne les outils pour soutenir efficacement une personne danssa recherche professionnelle et dans sa prise de poste"
            img="/static/img/help_2.png"
          />,
          <HelpingCard
            titleHead="Vous connaissez une personne en difficulté ? "
            titleMiddle="Entourage vous accompagne"
            titleTail=" dans les démarches"
            description="Vous n'êtes pas seul! Entourage vous donne les outils pour soutenir efficacement une personne danssa recherche professionnelle et dans sa prise de poste"
            img="/static/img/help_3.png"
          />,
        ]}
      />
    </Section>
    <Section style="muted">
      <div className="uk-text-center" id="scale">
        <h2>
          Aider <span className="uk-text-primary">à votre échelle</span>
        </h2>
        <Slider
          auto
          finite={false}
          childWidths={['1-1', '1-2@s', '1-4@m']}
          grid="small"
          items={[
            <ScaleCard
              title="Je suis un particulier"
              titleEmphaseStart={2}
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Laboriosam repellat suscipit, quo iure similique beatae
                recusandae eius itaque."
            />,
            <ScaleCard
              title="Je suis un acteur du millieu associatif"
              titleEmphaseStart={2}
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Laboriosam repellat suscipit, quo iure similique beatae
                recusandae eius itaque."
            />,
            <ScaleCard
              title="Je veux recruter"
              titleEmphaseStart={2}
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Laboriosam repellat suscipit, quo iure similique beatae
                recusandae eius itaque."
            />,
            <ScaleCard
              title="Je suis un travailleur social"
              titleEmphaseStart={2}
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Laboriosam repellat suscipit, quo iure similique beatae
                recusandae eius itaque."
            />,
          ]}
        />
        <Button style="primary">écrivez-nous</Button>
      </div>
    </Section>
    <DiscovertPartial />
  </div>
);

export default JeVeuxAider;
