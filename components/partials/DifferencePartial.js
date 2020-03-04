import React from 'react';
import Link from 'next/link';
import { Button, Section, IconNoSSR, GridNoSSR } from '../utils';

const datas = [
  {
    href: '/jeveuxtravailler',
    button: 'Je veux travailler',
    title: 'Découvrez les profils des candidats',
    description:
      'Nos candidats sont des gens en situation de précarité financière et professionnels, mais ils sont tous accompagnés par des travailleurs sociaux.',
  },
  {
    href: '/jeveuxaider',
    button: 'Je veux aider',
    title: 'Découvrez les profils des candidats',
    description:
      'Nos candidats sont des gens en situation de précarité financière et professionnels, mais ils sont tous accompagnés par des travailleurs sociaux.',
  },
  {
    href: '/jeveuxrecruter',
    button: 'Je veux recruter',
    title: 'Découvrez les profils des candidats',
    description:
      'Nos candidats sont des gens en situation de précarité financière et professionnels, mais ils sont tous accompagnés par des travailleurs sociaux.',
  },
];
const DifferencePartial = () => (
  <Section style="default" container="" id="profiles">
    <GridNoSSR gap="large" column>
      <div className="uk-text-center">
        <h2 className="uk-text-bold">
          <span className="uk-text-primary">Rejoignez</span> le mouvement
        </h2>
        <p>
          Depuis son lancement en juin 2019, de belles rencontres ont emmergé
          grace aux multiples partages.
        </p>
      </div>

      <GridNoSSR
        childWidths={['1-3@s']}
        center
        items={datas.map((value) => (
          <div className="uk-flex uk-flex-center">
            <div className="uk-width-medium">
              <GridNoSSR gap="small" column>
                <h4>{value.title}</h4>
                <hr
                  // className="uk-divider-small"
                  style={{ borderTopColor: '#F55F24', width: '100px' }}
                />
                <p>{value.description}</p>
              </GridNoSSR>
              <Link href={value.href}>
                <a
                  className="uk-button uk-button-primary uk-margin-top"
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
                  {value.button} &gt;
                </a>
              </Link>
            </div>
          </div>
        ))}
      />

      <>
        <p className="uk-text-center uk-margin-remove">
          Depuis son lancement en juin 2019, de belles rencontres ont emmergé
          grace aux multiples partages.
        </p>

        {/* input */}
        <div
          className="uk-align-center uk-text-center uk-width-1-2@s"
          data-uk-grid
        >
          <GridNoSSR
            eachWidths={['expand', 'auto']}
            className="uk-padding-remove"
            gap="collapse"
          >
            <div data-uk-form-custom="target: true" className="uk-width-1-1">
              <a className="uk-form-icon" disabled>
                <IconNoSSR name="mail" />
              </a>
              <input
                className="uk-input"
                type="text"
                placeholder="Votre adresse mail..."
                style={{ borderBottom: 0, borderRadius: '2px 0 0 2px' }}
              />
            </div>
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
              OK
            </button>
          </GridNoSSR>
        </div>
      </>

      <>
        <p className="uk-text-center">Suivez-nous sur :</p>
        <GridNoSSR center>
          {[
            {
              name: 'facebook',
              title: 'Facebook',
              href: 'https://www.facebook.com/EntourageReseauCivique/',
            },
            {
              name: 'twitter',
              title: 'Twitter',
              href: 'https://twitter.com/r_entourage/',
            },
            {
              name: 'linkedin',
              title: 'LinkedIn',
              href: 'https://www.linkedin.com/company/association-entourage/',
            },
          ].map(({ name, title, href }, key) => (
            <Link href={href} key={key}>
              <a
                className="uk-button uk-button-primary"
                target="_blank"
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
                {title} <IconNoSSR name={name} />
              </a>
            </Link>
          ))}
        </GridNoSSR>
      </>
    </GridNoSSR>
  </Section>
);
export default DifferencePartial;
