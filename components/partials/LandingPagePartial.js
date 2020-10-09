import React from 'react';
import {
  LinkedinShareButton,
  FacebookShareButton,
  TwitterShareButton,
} from 'react-share';
import { GridNoSSR, IconNoSSR, Section, Background, ImgNoSSR } from '../utils';

import {event} from '../../lib/gtag';
import TAGS from '../../constants/tags';

// Home page partials
const LandingPagePartial = () => {
  const sharedTitle = 'LinkedOut\xa0: partagez votre réseau avec ceux qui n’en ont pas';
  const sharedDescription =
    "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer.";
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

            <div className="uk-flex uk-flex-row uk-flex-center uk-flex-left@s uk-light">
              <FacebookShareButton
                onShareWindowClose={() => event(TAGS.HOME_PARTAGE_LKO_FACEBOOK_CLIC)}
                className="uk-icon-button uk-margin-right"
                url={sharedURL}
                quote={sharedDescription}
                hashtags={hashtags}>
                <IconNoSSR name="facebook" />
              </FacebookShareButton>
              <TwitterShareButton
                onShareWindowClose={() => event(TAGS.HOME_PARTAGE_LKO_TWITTER_CLIC)}
                url={sharedURL}
                title={sharedDescription}
                hashtags={hashtags}
                via={viaTwitter}
                className="uk-icon-button">
                <IconNoSSR name="twitter" />
              </TwitterShareButton>
              <LinkedinShareButton
                onShareWindowClose={() => event(TAGS.HOME_PARTAGE_LKO_LINKEDIN_CLIC)}
                className="uk-icon-button uk-margin-left"
                url={sharedURL}
                title={sharedTitle}
                description={sharedDescription}>
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
