import React from 'react';
import { GridNoSSR, Section } from '../utils';
import { CandidatCard } from '../cards';

const DiscovertPartial = () => (
  <Section id="discover">
    <div className="uk-text-center">
      <h2>
        Découvres les <span className="uk-text-primary">candidats</span>
      </h2>
      <a href="#">Voir tous les candidats -&gt;</a>
    </div>
    <div className="uk-margin-large">
      <GridNoSSR
        childWidths={['1-1', '1-2@s']}
        items={Array(2).fill(
          <CandidatCard
            imgSrc="static/img/arthur.png"
            imgAlt="arthur"
            title="Arthur"
            description="série télévisée d'animation américano-canadienne, basée sur
        Les Aventures d'Arthur de Marc Brown et diffusée depuis le
        7 octobre 1996 sur le réseau PBS."
            goods={['volontaire', "esprit d'équipe"]}
            ambitions={['la vente', 'la restauration']}
          />
        )}
      />
    </div>
  </Section>
);

export default DiscovertPartial;
