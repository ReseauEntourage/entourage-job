import React from 'react';
import { HelpingCard, ScaleCard } from '../components/cards';
import { Button, Section, GridNoSSR, SliderNoSSR } from '../components/utils';
import { DiscoverPartial } from '../components/partials';
import Layout from '../components/Layout';
import ProfilAidant from '../components/sections/ProfilAidant';

const JeVeuxAider = () => (
  <Layout title="Je veux aider - Entourage Jobs">
    <Section id="titre">
      <h1 className="uk-heading-medium uk-text-bold uk-text-center">
        Vous souhaitez <span className="uk-text-primary">aider ?</span>
      </h1>
      <p className="uk-text-lead uk-text-center" style={{ fontWeight: '600' }}>
        Il n&apos;y a pas de petit coup de pouce, aidez à votre échelle !
      </p>
    </Section>
    <ProfilAidant />
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
    <DiscoverPartial />
  </Layout>
);

export default JeVeuxAider;
