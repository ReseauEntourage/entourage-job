import React from 'react';
import { GridNoSSR, Section, IconNoSSR } from '../utils';
import { NumberCard } from '../cards';

const numbers = [
  { value: 73, description: '% des candidats ont retrouvé un job' },
  { value: 40000, description: 'Partages sur les réseaux de leur CV' },
  { value: 300, description: 'Entreprises solidaires' },
];
const data = [
  {
    imgSrc: '/static/img/arthur.png',
    imgAlt: 'arthur',
    title: 'Marco Deliia',
    role: 'Vendeur chez Leroy Merlin',
    description:
      'Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor incididunt.',
  },
  {
    title: 'Robert Dupont',
    role: 'Vendeur chez Leroy Merlin',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
  },
  {
    imgSrc: '/static/img/arthur.png',
    imgAlt: 'arthur',
    title: 'Adeline Picot',
    role: 'Vendeur chez Leroy Merlin',
    description:
      'Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor incididunt.',
  },
  {
    title: 'Adeline Picot',
    role: 'Vendeur chez Micromania',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
  },
  {
    imgSrc: '/static/img/arthur.png',
    imgAlt: 'arthur',
    title: 'Arthur Picot',
    role: 'Vendeur chez Leroy Merlin',
    description:
      'Lorem ipsum dolor sit amet, adipiscing elit, sed do eiusmod tempor incididunt.',
  },
  {
    title: 'Adeline Picot',
    role: 'Consultant chez Accenture',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
  },
];

const NumberPartial = () => (
  <Section style="muted" container="" id="profiles">
    <GridNoSSR
      gap="large"
      column
      middle
      eachWidths={['1-1', '1-1', '1-1', '1-1']}
    >
      {/* <GridNoSSR center eachWidths={['auto', '2-3@s']}> */}
      <div className="uk-text-center">
        <h2 className="uk-text-bold">
          Et le mieux c&apos;est que{' '}
          <span className="uk-text-primary">ça marche</span> !
        </h2>
        <p className="uk-text-center">
          Miah, Abdul, Anais, Manuel,... ont retrouvé un emploi grâce à
          LinkedOut
        </p>
      </div>
      {/* </GridNoSSR> */}
      <GridNoSSR
        center
        childWidths={['1-1', '1-2@s', '1-3@l']}
        items={numbers.map((content) => (
          <div className="uk-flex uk-flex-center">
            <NumberCard
              value={content.value}
              description={content.description}
            />
          </div>
        ))}
      />
      {/* <p className="uk-text-center">
        Linked Out est plébiscité par les candidats et aussi par les recruteurs.
      </p> */}

      <iframe
        src="https://www.youtube.com/embed/1cfmgC2IqWs"
        width="1280"
        height="720"
        frameBorder="0"
        allowFullScreen
        data-uk-responsive
        data-uk-video="automute: true; autoplay: inview"
        title="linkedout"
      />

      <div className="uk-position-relative" data-uk-slider="">
        <div className="uk-slider-container">
          <ul className="uk-slider-items uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-4@m uk-grid uk-grid-match uk-grid-small">
            {data.map(({ title, description, role, imgSrc, imgAlt }) => (
              <li>
                <div className="uk-card uk-card-small uk-card-default">
                  {imgSrc && (
                    <div className="uk-card-media-top">
                      <img
                        className="uk-height-small uk-width-1-1"
                        src={imgSrc}
                        alt={imgAlt}
                      />
                    </div>
                  )}
                  <GridNoSSR
                    gap="small"
                    between
                    column
                    eachWidths={['expand', 'auto']}
                    className={`uk-card-body ${!imgSrc && 'uk-height-1-1'}`}
                  >
                    <div>
                      <IconNoSSR
                        flip
                        className="uk-text-primary"
                        name="quote-right"
                        ratio={1.4}
                      />
                      <p className="uk-margin-remove">{description}</p>
                      <IconNoSSR
                        className="uk-text-muted uk-width-1-1 uk-text-right"
                        name="quote-right"
                        ratio={0.8}
                      />
                    </div>
                    <div className="uk-card-title">
                      <h3 className="uk-text-bold uk-text-small uk-margin-remove-bottom uk-text-uppercase">
                        {title}
                      </h3>
                      <p className="uk-text-meta uk-margin-remove-top">
                        {role}
                      </p>
                    </div>
                  </GridNoSSR>
                </div>
              </li>
            ))}
          </ul>
          <ul className="uk-slider-nav uk-dotnav uk-flex-center uk-margin" />
        </div>

        <div className="uk-hidden@l">
          <a
            href="#"
            className="uk-position-center-left uk-position-small"
            uk-slider-item="previous"
          >
            <IconNoSSR
              className="uk-text-primary uk-icon-button uk-overlay-default"
              name="chevron-left"
              ratio={2}
            />
          </a>
          <a
            href="#"
            className="uk-position-center-right uk-position-small"
            uk-slider-item="next"
          >
            <IconNoSSR
              className="uk-text-primary uk-icon-button uk-overlay-default"
              name="chevron-right"
              ratio={2}
            />
          </a>
        </div>
        <div className="uk-visible@l">
          <a
            href="#"
            className="uk-position-center-left-out uk-position-small"
            uk-slider-item="previous"
          >
            <IconNoSSR
              className="uk-text-primary"
              name="chevron-left"
              ratio={2}
            />
          </a>
          <a
            href="#"
            className="uk-position-center-right-out  uk-position-small"
            uk-slider-item="next"
          >
            <IconNoSSR
              className="uk-text-primary"
              name="chevron-right"
              ratio={2}
            />
          </a>
        </div>
      </div>
    </GridNoSSR>
  </Section>
);
export default NumberPartial;
