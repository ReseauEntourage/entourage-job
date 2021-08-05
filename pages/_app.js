/* eslint-disable react/prop-types */
import '../static/dist/css/uikit.entourage.min.css';
import '../static/css/styles.less';
import '../static/css/Forms.less';
import '../static/css/Toggle.less';

import React, { useContext, useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import * as Sentry from '@sentry/react';
import UserProvider from '../components/store/UserProvider';
import DataProvider from '../components/store/DataProvider';
import SessionProvider, {
  SessionContext,
} from '../components/store/SessionProvider';
import SharesCountProvider from '../components/store/SharesCountProvider';

import * as gtag from '../lib/gtag';
import SplashScreen from '../components/SplashScreen';

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: process.env.SENTRY_DSN,
});

const Container = ({ Component, pageProps, err }) => {
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
  }, [isFirstLoad, setIsFirstLoad]);

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
      <Component {...pageProps} err={err} />
      {!router.asPath.includes('/pdf/') && (
        <div
          style={{ height: '100vh', zIndex: 9999 }}
          className={`${loading ? 'uk-visible' : 'uk-hidden'} ${
            fading ? 'uk-animation-fade uk-animation-reverse' : ''
          } uk-position-cover uk-background-default`}
        >
          <SplashScreen />
        </div>
      )}
    </div>
  );
};

const EntourageApp = ({ Component, pageProps, err }) => {
  return (
    <Sentry.ErrorBoundary fallback="An error has occurred">
      <SessionProvider>
        <SharesCountProvider>
          <DataProvider>
            <UserProvider>
              <Container
                Component={Component}
                pageProps={pageProps}
                err={err}
              />
            </UserProvider>
          </DataProvider>
        </SharesCountProvider>
      </SessionProvider>
    </Sentry.ErrorBoundary>
  );
};

export default EntourageApp;
