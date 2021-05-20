import React from 'react';
import { GridNoSSR, Section } from '../utils';
import { NumberCard } from '../cards';

const staticNumbers = [
  { value: '45', description: 'Candidats recrutés sur la promo #2' },
  {
    value: '71%',
    description: 'De sorties positives',
    subDescription: 'calculé sur les candidats étant allé au bout du parcours',
  },
  { value: '32', description: 'Entreprises ont recruté' },
  { value: '263', description: "Offres d'emploi reçues" },
  {
    value: (
      <div>
        Administration
        <br />
        Logistique
        <br />
        Distribution
        <br />
        BTP
      </div>
    ),
    description: 'Sont les secteurs qui ont le plus recruté',
  },
];

const NumberPartial = () => {
  return (
    <Section style="muted" id="profiles">
      <h2 className="uk-text-bold uk-text-center">
        Et le mieux c&apos;est que{' '}
        <span className="uk-text-primary">ça marche</span> !
      </h2>
      <p className="uk-text-center uk-margin-medium-bottom">
        Miah, Abdul, Laith,... ont retrouvé un emploi grâce à LinkedOut
      </p>
      <GridNoSSR
        center
        childWidths={['1-1', '1-2@s', '1-3@l']}
        items={staticNumbers.map((content) => {
          return (
            <div className="uk-flex uk-flex-center">
              <NumberCard
                value={content.value}
                description={content.description}
                subDescription={content.subDescription}
              />
            </div>
          );
        })}
      />

      <iframe
        src="https://www.youtube.com/embed/1cfmgC2IqWs"
        width="1280"
        height="720"
        frameBorder="0"
        allowFullScreen
        data-uk-responsive
        data-uk-video="automute: true; autoplay: inview"
        title="linkedout"
        className="uk-margin-medium-top"
      />
    </Section>
  );
};

export default NumberPartial;
