import React from 'react';
import PropTypes from 'prop-types';
import { GridNoSSR, IconNoSSR, Button, Section, Background } from '../utils';
import { PresentationCard } from '../cards';

// Home page partials
const LandingPagePartial = ({ presentations }) => (
  <Background src="/static/img/background_1.png" position="top-right">
    <Section containerLarge>
      <GridNoSSR
        childWidths={['1-3@m', '1-2@s']}
        items={[
          <div>
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
          </div>,
        ]}
      />
      <GridNoSSR
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
          <IconNoSSR name="chevron-down" />
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

export default LandingPagePartial;
