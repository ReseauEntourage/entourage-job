import React from 'react';
import Link from 'next/link';
import { Section, GridNoSSR } from '../utils';

const datas = [
  {
    href: '/jeveuxtravailler',
    button: 'Je veux travailler',
    title: 'Je suis en galère',
  },
  {
    href: '/jeveuxaider',
    button: 'Je veux aider',
    title: 'Je suis un particulier ou un acteur du social',
  },
  {
    href: '/jeveuxrecruter',
    button: 'Je veux recruter',
    title: 'Découvrez les profils des candidats',
  },
];
const ActionPartial = () => (
  <Section style="default" id="profiles">
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
      <div uk-height-match="target : .azerty">
        <GridNoSSR
          childWidths={['1-3@s']}
          center
          match
          items={datas.map((value) => (
            <div className="uk-flex uk-flex-center uk-text-bottom">
              <div className="uk-width-medium uk-flex uk-flex-middle uk-flex-column">
                <GridNoSSR gap="small" middle column>
                  <h4 className="azerty  uk-flex uk-flex-top uk-text-center">
                    {value.title}
                  </h4>
                  <hr
                    // className="uk-divider-small"
                    style={{ borderTopColor: '#F55F24', width: '100px' }}
                  />
                  {/* <p>{value.description}</p> */}
                </GridNoSSR>
                <Link href={value.href}>
                  <a
                    className="uk-button uk-button-primary uk-margin-top"
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
              </div>
            </div>
          ))}
        />
      </div>
    </GridNoSSR>
  </Section>
);
export default ActionPartial;
