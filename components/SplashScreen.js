import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ImgNoSSR } from './utils/Img';

const SplashScreen = () => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      style={{ height: '100vh', zIndex: 9999 }}
      className="uk-position-cover uk-background-default uk-flex uk-flex-column uk-flex-center uk-flex-middle"
    >
      <div style={{ opacity: 0 }} className="uk-animation-fade">
        <img
          onLoad={() => setImgLoaded(true)}
          src="/static/img/linkedout_logo_orange_small.png"
          alt="LinkedOut by entourage"
          className="uk-width-medium uk-margin-medium-bottom"
        />
      </div>
     {/* {imgLoaded && (
        <h2
          className="uk-animation-fade uk-text-bold uk-text-center uk-width-xlarge@m uk-margin-remove"
          style={{ opacity: 0 }}
        >
          <span>Partagez votre </span>
          <span className="uk-text-primary">réseau professionnel</span>
          <span> avec ceux qui n&apos;en ont pas...</span>
        </h2>
      )} */}
    </div>
  );
};

SplashScreen.propTypes = {};

SplashScreen.defaultProps = {};

export default SplashScreen;

export const SplashScreenNoSSR = dynamic(() => import('./SplashScreen'), {
  ssr: false,
});
