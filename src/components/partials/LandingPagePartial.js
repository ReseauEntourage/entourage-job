import React from 'react';
import { Background, Grid, Img, Section } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';

const LandingPagePartial = () => {
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
          <Grid middle column gap="medium">
            <Img
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
              <span> avec ceux qui n&apos;en ont pas</span>
            </h1>
            <div className="uk-margin-bottom">
              <a
                className="ent-link-muted"
                href="#header"
                /* style={{ color: 'white' }} */
                data-uk-scroll="offset: -1"
              >
                <IconNoSSR name="chevron-down" ratio="2.5" />
              </a>
            </div>
          </Grid>
        </Section>
      </div>
    </Background>
  );
};

export default LandingPagePartial;
