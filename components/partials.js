import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  PresentationCard,
  CandidatCard,
  NumberCard,
  Grid,
  Section,
  Background,
} from './utils';

// Home page partials
export const LandingPagePartial = ({ presentations }) => (
  <Background src="/static/img/background_1.png" position="top-right">
    <Section containerLarge>
      <div data-uk-grid>
        <div className="uk-width-1-3@m uk-width-1-2@s">
          <h1 className="uk-heading-small uk-text-bold uk-text-center uk-text-left@s">
            <span>Partagez votre </span>
            <span className="uk-text-primary">réseau</span>
            <span> avec ceux qui n&apos;en ont pas</span>
          </h1>
          <div className="uk-margin-large-top uk-margin-large-bottom uk-text-center uk-text-left@s">
            <Button href="#" size="large" style="primary">
              partager l&apos;opération
            </Button>
          </div>
        </div>
      </div>
      <Grid
        match
        center
        childWidths={['1-3@s', '1-2']}
        items={presentations.map(({ imgSrc, imgAlt, text }) => (
          <PresentationCard imgSrc={imgSrc} imgAlt={imgAlt} text={text} />
        ))}
      />
      <div className="uk-light uk-flex uk-flex-center uk-padding-large uk-padding-remove-bottom">
        <p>Découvrez les candidats</p>
      </div>
      <div className="uk-flex uk-flex-center">
        <a className="uk-icon-button" href="#profiles" data-uk-scroll>
          <span data-uk-icon="chevron-down" />
        </a>
      </div>
    </Section>
  </Background>
);
LandingPagePartial.propTypes = {
  presentations: PropTypes.arrayOf(
    PropTypes.shape({
      imgSrc: PropTypes.string,
      imgAlt: PropTypes.string,
      text: PropTypes.string,
    })
  ).isRequired,
};

export const DifferencePartial = () => (
  <Section style="primary" size="large">
    <div className="uk-text-center">
      <p className="uk-text-lead">
        Vous sentez que vous pouvez{' '}
        <span className="uk-text-primary">faire la différence ?</span> À vous de
        jouer !
      </p>
      <div className="uk-button-group">
        <Button style="primary">je veux aider</Button>
        <Button style="default">je veux recruter</Button>
      </div>
    </div>
  </Section>
);

export const CandidatListPartial = () => (
  <Section style="default" size="large" id="profiles">
    <div className="uk-text-center uk-margin-large">
      <h3 className="uk-heading-small">
        <span className="uk-text-primary">Eux</span> cherchent un travail,
        <br />
        <span className="uk-text-primary">Vous</span> avez un réseau.
      </h3>
      <p>
        Nos candidats sont des gens en situation de précarité financière et
        professionnellle. Toutes accompagnées par des travailleurs sociaux,
        motivées pour se réinsérer, elles dévoilent leurs talents et leurs
        aspirations. Réseau, amis, recruteurs, à vos partages!
      </p>
    </div>
    <Grid
      childWidths={['1-1', '1-2@s', '1-3@m']}
      parallax={500}
      items={Array(6).fill(
        <CandidatCard
          imgSrc="static/img/arthur.png"
          imgAlt="arthur"
          title="Arthur"
          description="série télévisée d'animation américano-canadienne, basée sur
          Les Aventures d'Arthur de Marc Brown et diffusée depuis le
          7 octobre 1996 sur le réseau PBS."
          goods={['volontaire', "esprit d'équipe"]}
          ambitions={['la vente', 'la restauration']}
        />,
      )}
    />
    <div className="uk-with-1-1 uk-text-center uk-padding uk-padding-remove-bottom">
      <Button style="default">Voir plus</Button>
    </div>
  </Section>
);

export const ContactPartial = () => (
  <Section style="muted" size="large" id="contact">
    <h2 className="uk-text-center">
      <span>Gardons contact, </span>
      <span className="uk-text-primary">le programme évolue</span> !
    </h2>
    <div className="uk-margin-medium-top uk-flex uk-flex-center">
      <form>
        <div className="uk-button-group">
          <div data-uk-form-custom="target: true">
            <a className="uk-form-icon" href="#">
              <span uk-icon="icon: mail" />
            </a>
            <input
              className="uk-input"
              type="text"
              placeholder="Votre adresse mail"
            />
          </div>
          <button type="button" className="uk-button uk-button-default">
            Ecrivez-nous
          </button>
        </div>
      </form>
    </div>
  </Section>
);

export const EmphasePartial = () => (
  <Section style="secondary" size="large" id="emphase">
    <p className="uk-text-lead">
      Lorsqu&apos;on est désocialisé, on devient invisible. <br /> Les chance de
      retrouver du travail sont très faibles.
    </p>
    <p className="uk-text-lead">
      L&apos;association Entourage vous propose de faire un don de visibilité.
      <br />
      <span className="uk-text-primary">Un partage</span> peut tout changer.
    </p>
  </Section>
);

export const NumberPartial = ({ numbers }) => (
  <Section style="default" size="large">
    <div className="uk-text-center">
      <h3 className="uk-h6 uk-text-uppercase uk-margin-remove-bottom">
        Les chiffres
      </h3>
      <h2 className="uk-margin-remove-top">
        Un programme <span className="uk-text-primary">efficace</span>
      </h2>
    </div>
    <div className="uk-margin-large-top">
      <Grid
        childWidths={['1-1', '1-3@m']}
        items={numbers.map((content) => (
          <div className="  uk-flex uk-flex-center uk-flex-center">
            <NumberCard
              value={content.value}
              description={content.description}
            />
          </div>
        ))}
      />
    </div>
  </Section>
);
NumberPartial.propTypes = {
  numbers: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      description: PropTypes.string,
    })
  ).isRequired,
};

export const DiscovertPartial = () => (
  <Section id="discover">
    <div className="uk-text-center">
      <h2>
        Découvres les <span className="uk-text-primary">candidats</span>
      </h2>
      <a href="#">Voir tous les candidats -&gt;</a>
    </div>
    <div className="uk-margin-large">
      <Grid
        childWidths={['1-1', '1-2@s']}
        items={Array(2).fill([
          <CandidatCard
            imgSrc="static/img/arthur.png"
            imgAlt="arthur"
            title="Arthur"
            description="série télévisée d'animation américano-canadienne, basée sur
        Les Aventures d'Arthur de Marc Brown et diffusée depuis le
        7 octobre 1996 sur le réseau PBS."
            goods={['volontaire', "esprit d'équipe"]}
            ambitions={['la vente', 'la restauration']}
          />,
        ])}
      />
    </div>
  </Section>
);
