import React from 'react';
import { GridNoSSR, Button, IconNoSSR, Section, SimpleLink } from '../utils';
import { CandidatCard } from '../cards';

const items = Array(11).fill(
  <CandidatCard
    imgSrc="static/img/arthur.png"
    imgAlt="arthur"
    title="Arthur"
    description="série télévisée d'animation américano-canadienne."
    goods={['volontaire', "esprit d'équipe"]}
    ambitions={['la vente', 'la restauration']}
  />
);
/* items.push(<div className="uk-text-center uk-padding uk-padding-remove-bottom">
  <Button style="default">Voir plus</Button>
</div>); */
items.push(
  <div className="uk-flex uk-flex-column uk-flex-middle">
    <SimpleLink href="/contact">
      <span
        className="uk-icon-button"
        style={{ color: 'white', backgroundColor: '#F55F24' }}
      >
        <IconNoSSR name="plus" />
      </span>
    </SimpleLink>
    <SimpleLink href="/contact" className="uk-link-muted uk-padding-small">
      <span className="uk-text-bold">Voir plus</span>
    </SimpleLink>
  </div>
);

const CandidatListPartial = () => (
  <Section style="default" container="small" id="profiles">
    <div className="uk-text-center uk-margin-large">
      <h2 className="uk-text-bold">
        <span className="uk-text-primary">Eux</span> cherchent un travail,
        <br />
        <span className="uk-text-primary">Vous</span> avez un réseau.
      </h2>
      <p className="uk-align-center uk-width-2-3@s">
        Nos candidats sont des gens en situation de précarité financière et
        professionnellle. Toutes accompagnées par des travailleurs sociaux,
        motivées pour se réinsérer, elles dévoilent leurs talents et leurs
        aspirations. Réseau, amis, recruteurs, à vos partages !
      </p>
    </div>
    <GridNoSSR
      childWidths={['1-1', '1-2@s']}
      parallax={400}
      items={items}
      className="uk-padding-remove-bottom"
    />
  </Section>
);

export default CandidatListPartial;
