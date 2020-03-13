import React from 'react';
import Link from 'next/link';
import { GridNoSSR, Section } from '../utils';
import CVList from '../cv/CVList';

const CandidatListPartial = () => (
  <Section style="muted" container="" id="candidat">
    <GridNoSSR gap="large" column middle eachWidths={['2-3@s', '1-1']}>
      <div className="uk-text-center">
        <h2 className="uk-text-bold">
          Ils viennent de{' '}
          <span className="uk-text-primary">s&apos;inscrire</span>
        </h2>
        <p>
          Ils sont disponibles pour travailler. Découvrez leurs profils,
          partagez ou contactez-les.
        </p>
      </div>
      <CVList nb={9} />
      <GridNoSSR middle column gap="collapse">
        <Link href="/lescandidats">
          <button
            type="button"
            className="uk-button uk-button-primary"
            style={{
              color: 'white',
              backgroundColor: '#F55F24',
              backgroundImage: 'none',
              textTransform: 'none',
              boder: null,
              padding: '0px 20px',
              borderRadius: '2px',
            }}
          >
            Voir les candidats &gt;
          </button>
        </Link>
        <p style={{ marginTop: '20px' }}>
          En 2020, le projet est expérimenté à Paris et en Seine-Saint-Denis.
        </p>
      </GridNoSSR>
    </GridNoSSR>
  </Section>
);

export default CandidatListPartial;
