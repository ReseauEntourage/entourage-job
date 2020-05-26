import React from 'react';
import Link from 'next/link';
import { GridNoSSR, Section } from '../utils';
import CVList from '../cv/CVList';
import Button from "../utils/Button";

const CandidatListPartial = () => (
  <Section style="muted" id="candidat" className="uk-padding">
    <GridNoSSR column middle eachWidths={['2-3@m', '1-1']}>
      <div className="uk-text-center">
        <h2 className="uk-text-bold uk-margin-remove-bottom">
          Ils sont <span className="uk-text-primary">motivés</span> pour
          travailler
        </h2>
        <h3 className="uk-text-bold uk-margin-remove-top">
          Votre partage peut tout{' '}
          <span className="uk-text-primary">changer</span>
        </h3>
        <p className="uk-margin-remove-bottom">
          Eux ont du talent. Vous, vous avez du réseau. Si vous pensez comme
          nous que l&apos;exclusion ne doit pas être un frein, partagez votre
          réseau professionnel à ceux qui en ont le plus besoin.
        </p>
      </div>
      <CVList nb={9} />
      <GridNoSSR middle column gap="collapse">
        <Button
          href="/lescandidats"
          style='primary'>
          Voir tous les candidats &gt;
        </Button>
        <p style={{ marginTop: '20px' }}>
          Tous ces candidats cherchent un travail en Île de France, si vous
          êtes sur un autre territoire, contactez-nous à
          contact-linkedout@entourage.social
        </p>
      </GridNoSSR>
    </GridNoSSR>
  </Section>
);

export default CandidatListPartial;
