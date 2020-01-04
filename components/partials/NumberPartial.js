import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, Section } from '../utils';
import { NumberCard } from '../cards';

const numbers = [
  { value: 15, description: 'Candidats accompagnés' },
  { value: 342, description: 'CVs partagés' },
  { value: 5, description: 'Personnes réinsérées' },
];

const NumberPartial = () => (
  <Section style="muted" container="small" id="profiles">
    <GridNoSSR gap="large" column middle childWidths={['1-1']}>
      <GridNoSSR center eachWidths={['auto', '2-3@s']}>
        <h2 className="uk-text-bold">
          <span className="uk-text-primary">Linked Out</span>, un programme qui
          fonctionne
        </h2>
        <p className="uk-text-center">
          Depuis son lancement en juin 2019, de belles rencontres ont emmergé
          grace aux multiples partages.
        </p>
      </GridNoSSR>
      <GridNoSSR
        center
        childWidths={['1-1', '1-3@s']}
        items={numbers.map((content) => (
          <NumberCard value={content.value} description={content.description} />
        ))}
      />
      <p className="uk-text-center">
        Linked Out est plébiscité par les candidats et aussi par les recuteurs.
      </p>
      {/* todo: slideshow */}
    </GridNoSSR>
  </Section>
);
export default NumberPartial;
