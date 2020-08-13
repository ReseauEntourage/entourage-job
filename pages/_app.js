/* eslint-disable react/jsx-props-no-spreading,no-restricted-globals,react/prop-types */
import '../static/dist/css/uikit.entourage.css';
import '../static/css/styles.less';
import '../static/css/Forms.less';
import '../static/css/Toggle.less';

import React, {useEffect, useState} from 'react';
import Router from 'next/router';
import UserProvider from '../components/store/UserProvider';
import SharesCountProvider from "../components/store/SharesCountProvider";

import * as gtag from '../lib/gtag';
import SplashScreen, {SplashScreenNoSSR} from "../components/SplashScreen";

const EntourageApp = ({Component, pageProps}) => {

  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    Router.events.on('routeChangeComplete', (url) => {
      gtag.pageview(url);
      window.scrollTo(0, 0);
    });

    setTimeout(() => {
      setFading(true);
    }, 4000);
  }, []);

  useEffect(() => {
    if (fading) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [fading]);

  return (
    <SharesCountProvider>
      <UserProvider>
        <div
          style={{height: loading ? '100vh' : 'inherit'}}
          className="uk-inline uk-width-expand uk-overflow-hidden">
          <Component {...pageProps} />
          <div
            style={{height: '100vh', zIndex: 9999}}
            className={`${loading ? 'uk-visible' : 'uk-hidden'} ${fading ? 'uk-animation-fade uk-animation-reverse' : ''} uk-position-cover uk-background-default`}>
            <SplashScreenNoSSR />
          </div>
        </div>
      </UserProvider>
    </SharesCountProvider>
  );
};

export default EntourageApp;
