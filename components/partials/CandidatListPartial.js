import React from 'react';
import { GridNoSSR, Button, Section } from '../utils';
import { CandidatCard } from '../cards';

const CandidatListPartial = () => (
  <Section style="default" id="profiles">
    <div className="uk-text-center uk-margin-large">
      <h2 className="uk-text-bold">
        <span className="uk-text-primary">Eux</span> cherchent un travail,
        <br />
        <span className="uk-text-primary">Vous</span> avez un réseau.
      </h2>
      <p className="uk-align-center uk-width-1-2@m uk-width-2-3@s">
        Nos candidats sont des gens en situation de précarité financière et
        professionnellle. Toutes accompagnées par des travailleurs sociaux,
        motivées pour se réinsérer, elles dévoilent leurs talents et leurs
        aspirations. Réseau, amis, recruteurs, à vos partages !
      </p>
    </div>
    <GridNoSSR
      childWidths={['1-1', '1-2@s']}
      /* parallax={500} */
      items={Array(6).fill(
        <CandidatCard
          imgSrc="static/img/arthur.png"
          imgAlt="arthur"
          title="Arthur"
          description="série télévisée d'animation américano-canadienne."
          goods={['volontaire', "esprit d'équipe"]}
          ambitions={['la vente', 'la restauration']}
        />
      )}
    />
    <div className="uk-with-1-1 uk-text-center uk-padding uk-padding-remove-bottom">
      <Button style="default">Voir plus</Button>
    </div>
  </Section>
);

export default CandidatListPartial;
