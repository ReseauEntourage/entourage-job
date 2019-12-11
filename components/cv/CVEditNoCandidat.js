import React from 'react';
import { Section } from '../utils';

const CVEditNoCandidat = () => (
  <Section>
    <div className="uk-width-1-1" data-uk-height-viewport="expand: true">
      <div
        className="uk-position-absolute uk-transform-center uk-text-center"
        style={{ left: '50%', top: '50%' }}
      >
        <h2 className="uk-text-bold">
          <span className="uk-text-primary">Aucun candidat</span> n&apos;est
          rattaché à ton compte coach.
        </h2>
        <p>
          Il peut y avoir plusieurs raisons à ce sujet. Contacte l&apos;équipe
          LinkedOut pour en savoir plus.
        </p>
      </div>
    </div>
  </Section>
);

export default CVEditNoCandidat;
