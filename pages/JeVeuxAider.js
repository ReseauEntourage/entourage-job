import React, { Fragment } from 'react';
import { HelpingCard, ScaleCard } from '../components/cards';
import { Button, Section, GridNoSSR, SliderNoSSR } from '../components/utils';
import { DiscovertPartial } from '../components/partials';

const JeVeuxAider = () => (
  <Fragment>
    <Section id="help" style="default">
      <h1 className="uk-text-center">
        Vous souhaitez <span className="uk-text-primary">aider</span> ?
      </h1>
      <GridNoSSR
        childWidths={['1-1', '1-3@m']}
        grid="small"
        items={[
          <HelpingCard
            titleHead="Vous connaissez une personne en difficulté ? "
            titleMiddle="Entourage vous accompagne"
            titleTail=" dans les démarches"
            description="Vous n'êtes pas seul! Entourage vous donne les outils pour soutenir efficacement une personne danssa recherche professionnelle et dans sa prise de poste"
            img="/static/img/help_1.png"
            alt="help_1"
          />,
          <HelpingCard
            titleHead="Vous connaissez une personne en difficulté ? "
            titleMiddle="Entourage vous accompagne"
            titleTail=" dans les démarches"
            description="Vous n'êtes pas seul! Entourage vous donne les outils pour soutenir efficacement une personne danssa recherche professionnelle et dans sa prise de poste"
            img="/static/img/help_2.png"
            alt="help_2"
          />,
          <HelpingCard
            titleHead="Vous connaissez une personne en difficulté ? "
            titleMiddle="Entourage vous accompagne"
            titleTail=" dans les démarches"
            description="Vous n'êtes pas seul! Entourage vous donne les outils pour soutenir efficacement une personne danssa recherche professionnelle et dans sa prise de poste"
            img="/static/img/help_3.png"
            alt="help_3"
          />,
        ]}
      />
    </Section>
    <Section style="muted">
      <div className="uk-text-center" id="scale">
        <h2>
          Aider <span className="uk-text-primary">à votre échelle</span>
        </h2>
        <SliderNoSSR
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
  </Fragment>
);

export default JeVeuxAider;
