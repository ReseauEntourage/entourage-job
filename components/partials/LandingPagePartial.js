import React from 'react';
import PropTypes from 'prop-types';
import { LinkedinShareButton } from 'react-share';
import { GridNoSSR, IconNoSSR, Button, Section, Background } from '../utils';
import { PresentationCard } from '../cards';

// Home page partials
const LandingPagePartial = ({ presentations }) => {
  const sharedTitle = 'Entourage Jobs';
  const sharedDescription =
    "Lorsqu'on est désocialisé, on devient invisible. Les chances de retrouver du travail sont très faibles. Un partage peut tout changer. Eux cherchent du travail , vous avez du réseau.";
  return (
    <Background src="/static/img/background_1.png" position="top-right">
      <Section container="large">
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
                <LinkedinShareButton
                  title={sharedTitle}
                  description={sharedDescription}
                  url="https://entourage-job-preprod.herokuapp.com/"
                >
                  <Button size="large" style="primary">
                    partager l&apos;opération
                  </Button>
                </LinkedinShareButton>
              </div>
            </div>,
          ]}
        />
        <GridNoSSR
          match
          center
          childWidths={['1-3@m', '1-2@s']}
          items={presentations.map(({ imgSrc, imgAlt, text }) => (
            <PresentationCard imgSrc={imgSrc} imgAlt={imgAlt} text={text} />
          ))}
        />
        <div className="uk-light uk-flex uk-flex-center uk-padding-large uk-padding-remove-bottom">
          <p className="uk-text-bold">Découvrez les candidats</p>
        </div>
        <div className="uk-flex uk-flex-center">
          <a className="uk-icon-button" href="#profiles" data-uk-scroll>
            <IconNoSSR name="chevron-down" />
          </a>
        </div>
      </Section>
    </Background>
  );
};
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
