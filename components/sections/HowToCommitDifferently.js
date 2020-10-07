import React from 'react';
import { Section } from '../utils';
import Button from '../utils/Button';
import MultipleCTA from '../partials/MultipleCTA';

const HowToCommitDifferently = () => {
  return (
    <Section container="small">
      <h2 className="uk-text-center uk-text-bold">
        <span className="uk-text-primary">S'engager</span>&nbsp;autrement avec
        LinkedOut
      </h2>
      <p className="uk-text-center uk-margin-medium-top">
        Vous n'avez pas la possibilité de recruter ? Il existe d'autres manières
        de rendre votre entreprise plus inclusive avec LinkedOut.
      </p>
      <ul
        className="uk-margin-large-top"
        style={{ justifyContent: 'space-evenly' }}
        data-uk-tab=".uk-switcher"
      >
        <li>
          <a href="#">
            <h3 className="uk-text-bold">S'informer</h3>
          </a>
        </li>
        <li>
          <a href="#">
            <h3 className="uk-text-bold">Engager mes collaborateurs</h3>
          </a>
        </li>
        <li>
          <a href="#">
            <h3 className="uk-text-bold">Financer</h3>
          </a>
        </li>
      </ul>
      <ul className="uk-switcher uk-flex uk-flex-center uk-margin-large-top">
        <li className="uk-flex">
          <MultipleCTA
            showHorizontalDividers
            spacing="large"
            data={[
              {
                title: (
                  <h4 className="uk-text-bold">
                    Comment et pourquoi devenir une entreprises inclusive ?
                  </h4>
                ),
                text: (
                  <div>
                    @TODO text à intégrer Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Vivamus et lectus ut enim
                    feugiat fermentum. Etiam efficitur bibendum tincidunt. Fusce
                    sollicitudin justo a nisi tempor, sit amet sagittis dui
                    condimentum
                  </div>
                ),
                button: {
                  label: 'En savoir plus',
                  size: 'small',
                  href: '/entreprises/sensibiliser',
                },
              },
              {
                title: (
                  <h4 className="uk-text-bold">Ateliers de sensibilisation</h4>
                ),
                text: (
                  <div>
                    Nous proposons des ateliers de sensibilisation pour ouvrir
                    le dialogue autour de ce sujet dans votre entreprise, sentir
                    la sensibilité de vos collaborateurs et co-construire une
                    démarche. Intéressé ?
                  </div>
                ),
                button: {
                  label: 'En savoir plus @TODO lien ?',
                  size: 'small',
                  href: '',
                },
              },
            ]}
          />
        </li>
        <li>
          <MultipleCTA
            spacing="large"
            showHorizontalDividers
            data={[
              {
                title: (
                  <h4 className="uk-text-bold">
                    Viraliser les CV des candidats LinkedOut
                  </h4>
                ),
                text: (
                  <div>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vivamus et lectus ut enim feugiat fermentum. Etiam efficitur
                    bibendum tincidunt. Fusce sollicitudin justo a nisi tempor,
                    sit amet sagittis dui condimentum
                  </div>
                ),
                button: {
                  label: 'Partager des CV @TODO lien ?',
                  size: 'small',
                  href: '',
                },
              },
              {
                title: (
                  <h4 className="uk-text-bold">Participer à Virtual Regatta</h4>
                ),
                text: (
                  <div>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vivamus et lectus ut enim feugiat fermentum. Etiam efficitur
                    bibendum tincidunt. Fusce sollicitudin justo a nisi tempor,
                    sit amet sagittis dui condimentum
                  </div>
                ),
                button: {
                  label: 'En savoir plus @TODO lien ?',
                  size: 'small',
                  href: '',
                },
              },
            ]}
          />
          <div>
            <MultipleCTA
              spacing="large"
              className="uk-margin-large-top"
              showHorizontalDividers
              data={[
                {
                  title: (
                    <h4 className="uk-text-bold">Inspirer avec son métier</h4>
                  ),
                  text: (
                    <div>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Vivamus et lectus ut enim feugiat fermentum. Etiam
                      efficitur bibendum tincidunt. Fusce sollicitudin justo a
                      nisi tempor, sit amet sagittis dui condimentum
                    </div>
                  ),
                  button: {
                    label: "Rejoindre l'annuaire métier @TODO lien ?",
                    size: 'small',
                    href: '',
                  },
                },
                {
                  title: (
                    <h4 className="uk-text-bold">Team building solidaire</h4>
                  ),
                  text: (
                    <div>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Vivamus et lectus ut enim feugiat fermentum. Etiam
                      efficitur bibendum tincidunt. Fusce sollicitudin justo a
                      nisi tempor, sit amet sagittis dui condimentum
                    </div>
                  ),
                  button: {
                    label: 'En savoir plus @TODO lien?',
                    size: 'small',
                    href: '',
                  },
                },
              ]}
            />
          </div>
        </li>
        <li className="uk-text-center">
          <h4 className="uk-text-bold">Faire un don</h4>
          <p className="uk-container-xsmall">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et
            lectus ut enim feugiat fermentum. Etiam efficitur bibendum
            tincidunt. Fusce sollicitudin justo a nisi tempor, sit amet sagittis
            dui condimentum
          </p>
          <div className="uk-flex uk-flex-center">
            <Button href="" style="primary">
              Faire un don @TODO lien ?
            </Button>
          </div>
        </li>
      </ul>
    </Section>
  );
};

export default HowToCommitDifferently;
