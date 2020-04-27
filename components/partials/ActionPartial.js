import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Section, GridNoSSR, IconNoSSR } from '../utils';

const datas = [
  {
    href: '/jeveuxtravailler',
    button: 'Je veux travailler',
    title: 'Je suis en galère',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium nam itaque soluta ad officiis minima! Ea inventore saepe quam accusamus?',
  },
  {
    href: '/jeveuxaider',
    button: 'Je veux aider',
    title: 'Je suis un particulier ou un acteur du social',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium nam itaque soluta ad officiis minima! Ea inventore saepe quam accusamus?',
  },
  {
    href: '/jeveuxrecruter',
    button: 'Je veux recruter',
    title: 'Découvrez les profils des candidats',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium nam itaque soluta ad officiis minima! Ea inventore saepe quam accusamus?',
  },
];
const ActionPartial = ({ style }) => (
  <Section style={style} id="actions">
    <GridNoSSR gap="large" column>
      <div className="uk-text-center">
        <h2 className="uk-text-bold">
          <span className="uk-text-primary">J&apos;agis</span> avec LinkedOut
        </h2>
        <p>
          Depuis son lancement en juin 2019, de belles rencontres ont emmergé
          grace aux multiples partages.
        </p>
      </div>

      <div uk-height-match="target : h4">
        <GridNoSSR
          childWidths={['1-3@s']}
          middle
          gap="large"
          items={datas.map((value) => (
            <GridNoSSR
              // uk-width-medium@s
              className="uk-text-center"
              gap="small"
              middle
              column
            >
              <h4>{value.title}</h4>
              <hr style={{ borderTopColor: '#F55F24', width: '100px' }} />
              <p>{value.description}</p>
              <Link href={value.href}>
                <a
                  className="uk-button uk-button-primary"
                  style={{
                    color: 'white',
                    backgroundColor: '#F55F24',
                    backgroundImage: 'none',
                    textTransform: 'none',
                    border: null,
                    padding: '0px 20px',
                    borderRadius: '2px',
                  }}
                >
                  {value.button} &gt;
                </a>
              </Link>
            </GridNoSSR>
          ))}
        />
      </div>
      <div>
        <div className="uk-text-center">
          <h3 className="uk-text-bold">
            Gardons contact,{' '}
            <span className="uk-text-primary">le programme évolue</span> !
          </h3>
        </div>
        {/* input */}
        <div className="uk-flex uk-flex-center">
          <GridNoSSR
            eachWidths={['expand', 'auto']}
            className="uk-width-1-2@s"
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
              Écrivez-moi
            </button>
          </GridNoSSR>
        </div>
      </div>
      <div>
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
            <a
              href={href}
              key={key}
              className="uk-button uk-button-primary"
              target="_blank"
              rel="noopener noreferrer"
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
          ))}
        </GridNoSSR>
      </div>
    </GridNoSSR>
  </Section>
);
ActionPartial.propTypes = {
  style: PropTypes.string,
};
ActionPartial.defaultProps = {
  style: 'default',
};

export default ActionPartial;
