/* eslint-disable react/jsx-props-no-spreading,no-restricted-globals,react/prop-types */
import '../static/dist/css/uikit.entourage.css';
import '../static/css/styles.less';
import '../static/css/Forms.less';
import '../static/css/Toggle.less';

import React, {useEffect, useState} from 'react';
import Router from 'next/router';
import UserProvider from '../components/store/UserProvider';
import SharesCountProvider from "../components/store/SharesCountProvider";
import {ImgNoSSR} from "../components/utils";

import * as gtag from '../lib/gtag';

const EntourageApp = ({Component, pageProps}) => {

  const [firstLoad, setFirstLoad] = useState(true);
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

    if (firstLoad) {
      setTimeout(() => {
        setFading(true);
      }, 4000);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fading) {
      setTimeout(() => {
        setLoading(false);
        setFirstLoad(false);
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
            className={`${loading ? 'uk-visible' : 'uk-hidden'} ${fading ? 'uk-animation-fade uk-animation-reverse' : ''} uk-position-cover uk-background-default uk-flex uk-flex-column uk-flex-center uk-flex-middle`}>
            <div uk-scrollspy="cls: uk-animation-fade;">
              <ImgNoSSR
                src="/static/img/linkedout_logo_orange_small.png"
                alt="LinkedOut by entourage"
                className="uk-width-medium uk-margin-medium-bottom"
              />
            </div>
            <h2
              uk-scrollspy="cls: uk-animation-fade; delay: 1600;"
              className="uk-text-bold uk-text-center uk-width-xlarge@m uk-margin-remove">
              <span>Partagez votre </span>
              <span className="uk-text-primary">réseau professionnel</span>
              <span> avec ceux qui n&apos;en ont plus&nbsp;...</span>
            </h2>
          </div>
        </div>
      </UserProvider>
    </SharesCountProvider>
  );
};

export default EntourageApp;
