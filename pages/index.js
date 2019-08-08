import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  PresentationCard,
  CandidatCard,
  Grid,
  Section,
  Background,
} from '../components/utils';

const Padding = ({ size, center, children }) => {
  let classBuffer = 'uk-padding';
  if (center) classBuffer += ' uk-flex uk-flex-center';
  if (size) classBuffer += ` uk-padding-${size}`;
  return <div className={classBuffer}>{children}</div>;
};
Padding.propTypes = {
  center: PropTypes.bool,
  size: PropTypes.string,
  children: PropTypes.element.isRequired,
};
Padding.defaultProps = {
  center: false,
  size: undefined,
};
const Index = () => (
  <div>
    <Background src="/static/img/background_1.png" position="top-right">
      <Section>
        <div data-uk-grid>
          <div className="uk-width-1-3@m uk-width-1-2@s">
            <h1 className="uk-margin-large-bottom uk-heading-small uk-text-bold uk-margin-large uk-text-center uk-text-left@s">
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
          items={[
            <PresentationCard
              imgSrc="/static/img/illustrations/helping_process.png"
              imgAlt="profiles"
              text="1. Découvrez les profils des candidats"
            />,
            <PresentationCard
              imgSrc="/static/img/illustrations/flyer_sharing.png"
              imgAlt="partage"
              text="2. Partagez leurs cv, ouvrez leur votre réseau"
            />,
            <PresentationCard
              imgSrc="/static/img/illustrations/friendship.png"
              imgAlt="échange"
              text="3. Permettez leur de trouver un travail"
            />,
          ]}
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
    <Section style="secondary" size="large" id="candidat">
      <p className="uk-text-lead">
        Lorsqu&apos;on est désocialisé, on devient invisible. <br /> Les chance
        de retrouver du travail sont très faibles.
      </p>
      <p className="uk-text-lead">
        L&apos;association Entourage vous propose de faire un don de visibilité.
        <br />
        <span className="uk-text-primary">Un partage</span> peut tout changer.
      </p>
    </Section>
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
        parallax="500"
        items={Array(6).fill([
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
      <div className="uk-with-1-1 uk-text-center uk-padding uk-padding-remove-bottom">
        <Button style="default">Voir plus</Button>
      </div>
    </Section>
    <Section style="primary" size="large">
      <div className="uk-text-center">
        <p className="uk-text-lead">
          Vous sentez que vous pouvez{' '}
          <span className="uk-text-primary">faire la différence ?</span> À vous
          de jouer !
        </p>
        <div className="uk-button-group">
          <Button style="primary">je veux aider</Button>
          <Button style="default">je veux recruter</Button>
        </div>
      </div>
    </Section>
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
          childWidths={['1-1', '1-3@s']}
          items={Array(3).fill([
            <div
              className="uk-grid-collapse uk-grid-small uk-grid-divider"
              data-uk-grid
            >
              <div className="uk-width-1-3">
                <div className="uk-text-center uk-text-primary">
                  <div className="uk-text-large">15</div>
                  <span uk-icon="icon: bolt" />
                </div>
              </div>
              <div className="uk-width-2-3">
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
              </div>
            </div>,
          ])}
        />
      </div>
    </Section>
    <Section style="muted" size="large">
      <div className="uk-text-center">
        <h3 className="uk-h6 uk-text-uppercase uk-margin-remove-bottom">
          Les chiffres
        </h3>
        <h2 className="uk-margin-remove-top">
          Un programme <span className="uk-text-primary">efficace</span>
        </h2>
      </div>
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
  </div>
);

export default Index;
