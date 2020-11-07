/* eslint-disable react/jsx-props-no-spreading,no-restricted-globals,react/prop-types */
import '../static/dist/css/uikit.entourage.min.css';
import '../static/css/styles.less';
import '../static/css/Forms.less';
import '../static/css/Toggle.less';

import React, { useContext, useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import UserProvider from '../components/store/UserProvider';
import SessionProvider, {
  SessionContext,
} from '../components/store/SessionProvider';
import SharesCountProvider from '../components/store/SharesCountProvider';

import * as gtag from '../lib/gtag';
import { SplashScreenNoSSR } from '../components/SplashScreen';

const Container = ({ Component, pageProps }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  const { isFirstLoad, setIsFirstLoad } = useContext(SessionContext);

  useEffect(() => {
    /*
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
    */

    Router.events.on('routeChangeComplete', (url) => {
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
      gtag.pageview(url);
      window.scrollTo(0, 0);
    });
    setTimeout(() => {
      setFading(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (fading) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [fading]);

  return (
    <div
      style={{ height: loading ? '100vh' : 'inherit' }}
      className="uk-inline uk-width-expand uk-overflow-hidden"
    >
      <Component {...pageProps} />
      {!router.asPath.includes('/pdf/') && (
        <div
          style={{ height: '100vh', zIndex: 9999 }}
          className={`${loading ? 'uk-visible' : 'uk-hidden'} ${
            fading ? 'uk-animation-fade uk-animation-reverse' : ''
          } uk-position-cover uk-background-default`}
        >
          <SplashScreenNoSSR fading={fading} />
        </div>
      )}
    </div>
  );
};

const EntourageApp = ({ Component, pageProps }) => {
  return (
    <SessionProvider>
      <SharesCountProvider>
        <UserProvider>
          <Container Component={Component} pageProps={pageProps} />
        </UserProvider>
      </SharesCountProvider>
    </SessionProvider>
  );
};

export default EntourageApp;
