import React from 'react';
import PropTypes from 'prop-types';
import {
  LinkedinShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from 'react-share';
import { GridNoSSR, IconNoSSR, Section, Background, ImgNoSSR } from '../utils';

// Home page partials
const LandingPagePartial = () => {
  const sharedTitle = 'Entourage Jobs';
  const sharedDescription =
    "Lorsqu'on est désocialisé, on devient invisible. Les chances de retrouver du travail sont très faibles. Un partage peut tout changer. Eux cherchent du travail , vous avez du réseau.";
  const hashtags = ['LinkedOut'];
  const sharedURL = process.env.SERVER_URL;
  const viaTwitter = 'R_Entourage';
  return (
    <Background
      blend={{ mode: 'soft-light', color: 'secondary' }}
      src="/static/img/arthur-background.jpg"
      position="top-right"
    >
      <div
        className="uk-flex uk-flex-1 uk-flex-center uk-flex-middle"
        uk-height-viewport="offset-bottom: 80px"
      >
        <Section container="large">
          <GridNoSSR middle column>
            <ImgNoSSR
              src="/static/img/logo-linkedout.png"
              alt="logo linkedout"
              width="250"
            />
            <h1
              className="uk-heading-small uk-text-bold uk-text-center uk-width-xxlarge"
              style={{ color: 'white' }}
            >
              <span>Partagez votre </span>
              <span className="uk-text-primary">réseau professionnel</span>
              <span> avec ceux qui n&apos;en ont plus</span>
            </h1>

            <div className="uk-flex uk-flex-row uk-flex-center uk-flex-left@s">
              <FacebookShareButton
                className="uk-icon-link uk-text-primary uk-margin-right"
                url={sharedURL}
                quote={sharedDescription}
                hashtags={hashtags}
                style={{ cursor: 'pointer' }}
              >
                <IconNoSSR name="facebook" ratio={2} />
              </FacebookShareButton>
              <LinkedinShareButton
                className="uk-icon-link uk-text-primary uk-margin-right"
                url={sharedURL}
                title={sharedTitle}
                description={sharedDescription}
                style={{ cursor: 'pointer' }}
              >
                <IconNoSSR name="linkedin" ratio={2} />
              </LinkedinShareButton>
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
          </GridNoSSR>
        </Section>
      </div>
    </Background>
  );
};
LandingPagePartial.propTypes = {};

export default LandingPagePartial;
