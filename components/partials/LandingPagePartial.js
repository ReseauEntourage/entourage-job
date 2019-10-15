import React from 'react';
import PropTypes from 'prop-types';
import {
  LinkedinShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from 'react-share';
import { GridNoSSR, IconNoSSR, Button, Section, Background } from '../utils';
import { PresentationCard } from '../cards';

// Home page partials
const LandingPagePartial = ({ presentations }) => {
  const sharedTitle = 'Entourage Jobs';
  const sharedDescription =
    "Lorsqu'on est désocialisé, on devient invisible. Les chances de retrouver du travail sont très faibles. Un partage peut tout changer. Eux cherchent du travail , vous avez du réseau.";
  const hashtags = ['LinkedOut'];
  const sharedURL = process.env.SERVER_URL;
  const viaTwitter = 'R_Entourage';
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
                <h2 className="uk-text-bold uk-text-uppercase">
                  Partager l&apos;opération
                </h2>
                <div className="uk-flex uk-flex-row uk-flex-center uk-flex-left@s">
                  <LinkedinShareButton
                    className="uk-icon-link uk-text-primary uk-margin-right"
                    url={sharedURL}
                    title={sharedTitle}
                    description={sharedDescription}
                    style={{ cursor: 'pointer' }}
                  >
                    <IconNoSSR name="linkedin" ratio={2} />
                  </LinkedinShareButton>
                  <FacebookShareButton
                    className="uk-icon-link uk-text-primary uk-margin-right"
                    url={sharedURL}
                    quote={sharedDescription}
                    hashtags={hashtags}
                    style={{ cursor: 'pointer' }}
                  >
                    <IconNoSSR name="facebook" ratio={2} />
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={sharedURL}
                    title={sharedDescription}
                    hashtags={hashtags}
                    via={viaTwitter}
                    style={{ cursor: 'pointer' }}
                    className="uk-icon-link uk-text-primary primary uk-margin-right"
                  >
                    <IconNoSSR name="twitter" ratio={2} />
                  </TwitterShareButton>
                </div>
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
