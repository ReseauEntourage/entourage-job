import React from 'react';
import dynamic from 'next/dynamic';
import { Img } from 'src/components/utils';

const SplashScreen = () => {
  return (
    <div
      style={{ height: '100vh', zIndex: 9999 }}
      className="uk-position-cover uk-background-default uk-flex uk-flex-column uk-flex-center uk-flex-middle"
    >
      <div style={{ opacity: 0 }} className="uk-animation-fade">
        <Img
          src="/static/img/linkedout_logo_orange_small.png"
          alt="LinkedOut by entourage"
          className="uk-width-medium uk-margin-medium-bottom"
        />
      </div>
    </div>
  );
};

SplashScreen.propTypes = {};

SplashScreen.defaultProps = {};

export default SplashScreen;

export const SplashScreenNoSSR = dynamic(
  () => {
    return import('src/components/SplashScreen');
  },
  {
    ssr: false,
  }
);
