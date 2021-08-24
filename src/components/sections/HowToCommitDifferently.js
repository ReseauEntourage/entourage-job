import React from 'react';
import { Section } from 'src/components/utils';
import { EXTERNAL_LINKS } from 'src/constants';
import MultipleCTA from 'src/components/partials/MultipleCTA';

const HowToCommitDifferently = () => {
  return (
    <Section container="small" id="sengager" style="muted">
      <h2 className="uk-text-center uk-text-bold">
        <span className="uk-text-primary"> S&apos;engager</span>&nbsp;autrement
        avec LinkedOut
      </h2>
      <h4 className="uk-text-center uk-margin-medium-top">
        Vous n&apos;avez pas la possibilité de recruter ?
        <br />
        Il existe d&apos;autres manières de rendre votre entreprise plus
        inclusive avec LinkedOut.
      </h4>
      <MultipleCTA
        showHorizontalDividers
        spacing="large"
        className="uk-margin-large-top"
        data={[
          {
            title: (
              <h4 className="uk-text-bold">
                Comment et pourquoi devenir une entreprise inclusive ?
              </h4>
            ),
            text: (
              <p>
                Découvrez du contenu pour démarrer et des ressources pour vous
                lancer.
              </p>
            ),
            button: {
              label: 'En savoir plus',
              href: '/entreprises/sinformer',
            },
          },
          {
            title: <h4 className="uk-text-bold">Faire un don</h4>,
            text: (
              <p>
                Soutenez le déploiement de LinkedOut et permettez
                <br />à des centaines de personnes d’accéder à l’emploi.
              </p>
            ),
            button: {
              label: 'Nous soutenir',
              href: EXTERNAL_LINKS.DONATION,
              external: true,
            },
          },
        ]}
      />
    </Section>
  );
};

export default HowToCommitDifferently;
