/* eslint-disable react/prop-types */
import 'static/dist/css/uikit.entourage.min.css';
import 'static/css/styles.less';
import 'static/css/Forms.less';
import 'static/css/Toggle.less';

import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import * as Sentry from '@sentry/react';
import UserProvider from 'src/components/store/UserProvider';
import DataProvider from 'src/components/store/DataProvider';

import SharesCountProvider from 'src/components/store/SharesCountProvider';

import * as gtag from 'src/lib/gtag';
import SplashScreen from 'src/components/SplashScreen';
import { useMount } from 'src/hooks/utils';

Sentry.init({
  enabled: process.env.NODE_ENV === 'production',
  dsn: process.env.SENTRY_DSN,
});

const SplashScreenContainer = ({ loading, fading }) => {
  const router = useRouter();

  return !router.asPath.includes('/pdf/') ? (
    <div
      style={{ height: '100vh', zIndex: 9999 }}
      className={`${loading ? 'uk-visible' : 'uk-hidden'} ${
        fading ? 'uk-animation-fade uk-animation-reverse' : ''
      } uk-position-cover uk-background-default`}
    >
      <SplashScreen />
    </div>
  ) : undefined;
};

const Container = ({ Component, pageProps, err }) => {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  useMount(() => {
    Router.events.on('routeChangeComplete', (url) => {
      gtag.pageview(url);
      /* window.scrollTo(0, 0); */
    });
    setTimeout(() => {
      setFading(true);
    }, 1000);
  });

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
      <SplashScreenContainer loading={loading} fading={fading} />
    </div>
  );
};

const EntourageApp = ({ Component, pageProps, err }) => {
  return (
    <Sentry.ErrorBoundary fallback="An error has occurred">
      <SharesCountProvider>
        <DataProvider>
          <UserProvider>
            <Container Component={Component} pageProps={pageProps} err={err} />
          </UserProvider>
        </DataProvider>
      </SharesCountProvider>
    </Sentry.ErrorBoundary>
  );
};

export default EntourageApp;
