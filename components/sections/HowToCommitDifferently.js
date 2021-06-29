import React from 'react';
import { Section } from '../utils';
import { CONTACT_INFO } from '../../constants';
import Button from '../utils/Button';
import MultipleCTA from '../partials/MultipleCTA';

const HowToCommitDifferently = () => {
  return (
    <Section container="small" id="sengager">
      <h2 className="uk-text-center uk-text-bold">
        <span className="uk-text-primary"> S&apos;engager</span>&nbsp;autrement
        avec LinkedOut
      </h2>
      <p className="uk-text-center uk-margin-medium-top">
        Vous n&apos;avez pas la possibilité de recruter ?
      </p>
      <p className="uk-text-center">
        Il existe d&apos;autres manières de rendre votre entreprise plus
        inclusive avec LinkedOut.
      </p>
      <p className="uk-text-center">
        Vous ne savez pas par où commencer&nbsp;?{' '}
        <a
          style={{ textDecoration: 'underline' }}
          href="https://entourage-asso.typeform.com/to/LsizgJxd"
          rel="noopener noreferrer"
          target="_blank"
        >
          Faites votre diagnostic et laissez-vous guider
        </a>
      </p>
      <ul className="uk-margin-large-top" data-uk-accordion="multiple: true">
        <li className="uk-open">
          <a href="#" className="uk-accordion-title">
            <h3 className="uk-text-bold"> S&apos;informer</h3>
            <hr />
          </a>
          <div className="uk-accordion-content">
            <MultipleCTA
              showHorizontalDividers
              spacing="large"
              className="uk-margin-medium-bottom"
              data={[
                {
                  title: (
                    <h4 className="uk-text-bold">
                      Comment et pourquoi devenir une entreprise inclusive ?
                    </h4>
                  ),
                  text: (
                    <p>
                      Découvrez du contenu pour démarrer et des ressources pour
                      vous lancer.
                    </p>
                  ),
                  button: {
                    label: 'En savoir plus',
                    size: 'small',
                    href: '/entreprises/sinformer',
                  },
                },
                {
                  title: (
                    <h4 className="uk-text-bold">
                      Ateliers de sensibilisation
                    </h4>
                  ),
                  text: (
                    <p>
                      Nous vous proposons des ateliers pour aborder le sujet de
                      l&apos;inclusion avec vos collaborateurs.
                      Intéressés&nbsp;?
                    </p>
                  ),
                  button: {
                    label: 'Nous contacter',
                    size: 'small',
                    external: true,
                    href: `mailto:${CONTACT_INFO.CORPORATE_CONTACT}`,
                  },
                },
              ]}
            />
          </div>
        </li>
        <li>
          <a href="#" className="uk-accordion-title">
            <h3 className="uk-text-bold">Engager mes collaborateurs</h3>
            <hr />
          </a>
          <div className="uk-accordion-content">
            <MultipleCTA
              spacing="large"
              showHorizontalDividers
              className="uk-margin-medium-bottom"
              data={[
                {
                  title: (
                    <h4 className="uk-text-bold">
                      Viraliser les CV des candidats LinkedOut
                    </h4>
                  ),
                  text: (
                    <p>
                      Faites connaître l’opération LinkedOut à vos salariés, et
                      incitez-les à contribuer à la diffusion des CV.
                    </p>
                  ),
                  button: {
                    label: 'Partager des CV',
                    size: 'small',
                    href: '/candidats',
                  },
                },
                {
                  title: (
                    <h4 className="uk-text-bold">Inspirer avec son métier</h4>
                  ),
                  text: (
                    <p>
                      Soyez contactés ponctuellement par un candidat LinkedOut
                      pour répondre à des questions sur un métier ou un secteur
                      que vous connaissez bien.
                    </p>
                  ),
                  button: {
                    label: "Rejoignez l'annuaire métier",
                    size: 'small',
                    href: 'https://entourage-asso.typeform.com/to/Vo3eaU1i',
                    external: true,
                  },
                },
                {
                  title: (
                    <h4 className="uk-text-bold">Team building solidaire</h4>
                  ),
                  text: (
                    <p>
                      Sensibilisez vos collaborateurs à la lutte contre
                      l’exclusion et renforcez la cohésion de vos équipes au
                      travers de nos team buildings sur-mesure.
                    </p>
                  ),
                  button: {
                    label: 'En savoir plus',
                    size: 'small',
                    href: 'https://www.entourage.social/osez-la-rencontre/',
                    external: true,
                  },
                },
              ]}
            />
          </div>
        </li>
        <li>
          <a href="#" className="uk-accordion-title">
            <h3 className="uk-text-bold">Financer</h3>
            <hr />
          </a>
          <div className="uk-accordion-content">
            <MultipleCTA
              spacing="large"
              showHorizontalDividers
              className="uk-margin-medium-bottom"
              data={[
                {
                  title: <h4 className="uk-text-bold">Faire un don</h4>,
                  text: (
                    <p>
                      Soutenez le déploiement de LinkedOut et permettez
                      <br />à des centaines de personnes d’accéder à l’emploi.
                    </p>
                  ),
                  button: {
                    label: 'Nous contacter',
                    size: 'small',
                    href: `mailto:${CONTACT_INFO.CORPORATE_CONTACT}`,
                    external: true,
                  },
                },
              ]}
            />
          </div>
        </li>
      </ul>
    </Section>
  );
};

export default HowToCommitDifferently;
