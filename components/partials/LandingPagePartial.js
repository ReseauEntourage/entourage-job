import React from 'react';
import {
  LinkedinShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from 'react-share';
import { GridNoSSR, IconNoSSR, Section, Background, ImgNoSSR } from '../utils';

// Home page partials
const LandingPagePartial = () => {
  const sharedTitle = 'LinkedOut';
  const sharedDescription =
    "Lorsqu'on est désocialisé, on devient invisible. Les chances de retrouver du travail sont très faibles. Un partage peut tout changer. Eux cherchent du travail, vous avez du réseau.";
  const hashtags = ['LinkedOut'];
  const sharedURL = process.env.SERVER_URL;
  const viaTwitter = 'R_Entourage';
  return (
    <Background
      blend={{ mode: 'soft-light', colorHex: 'rgba(0,0,0,0.4)' }}
      src="/static/img/cover-linkedout.jpg"
      position="top-center"
    >
      <div
        className="uk-flex uk-flex-1 uk-flex-center"
        data-uk-height-viewport="offset-bottom: 40"
      >
        <Section container="large" className="uk-padding-remove-bottom">
          <GridNoSSR middle column gap="medium">
            <ImgNoSSR
              src="/static/img/linkedout_logo_white.png"
              alt="LinkedOut by entourage"
              className="uk-width-medium"
              // width="300"
            />
            <h1
              className="uk-text-bold uk-text-center uk-width-xlarge@m"
              style={{ color: 'white' }}
            >
              <span>Partagez votre </span>
              <span className="uk-text-primary">réseau professionnel</span>
              <span> avec ceux qui n&apos;en ont plus</span>
            </h1>

            <div className="uk-flex uk-flex-row uk-flex-center uk-flex-left@s">
              <FacebookShareButton
                className="uk-icon-button uk-icon-link uk-text-primary uk-margin-right"
                url={sharedURL}
                quote={sharedDescription}
                hashtags={hashtags}
                style={{ cursor: 'pointer' }}
              >
                <IconNoSSR name="facebook" />
              </FacebookShareButton>
              <TwitterShareButton
                url={sharedURL}
                title={sharedDescription}
                hashtags={hashtags}
                via={viaTwitter}
                style={{ cursor: 'pointer' }}
                className="uk-icon-button uk-icon-link uk-text-primary uk-margin-right"
              >
                <IconNoSSR name="twitter" />
              </TwitterShareButton>
              <LinkedinShareButton
                className="uk-icon-button uk-icon-link uk-text-primary"
                url={sharedURL}
                title={sharedTitle}
                description={sharedDescription}
                style={{ cursor: 'pointer' }}
              >
                <IconNoSSR name="linkedin" />
              </LinkedinShareButton>
            </div>
            <div>
              <a
                className="ent-link-muted"
                href="#header"
                /* style={{ color: 'white' }} */
                data-uk-scroll="offset: -1"
              >
                <IconNoSSR name="chevron-down" ratio="2.5" />
              </a>
            </div>
          </GridNoSSR>
        </Section>
      </div>
    </Background>
  );
};
LandingPagePartial.propTypes = {};

export default LandingPagePartial;
