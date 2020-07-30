/* eslint-disable react/jsx-props-no-spreading */
import '../static/dist/css/uikit.entourage.css';
import '../static/css/styles.less';
import '../static/css/Forms.less';
import '../static/css/Toggle.less';

import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import UserProvider from '../components/store/UserProvider';

import * as gtag from '../lib/gtag';
import SharesCountProvider from "../components/store/SharesCountProvider";

class EntourageApp extends App {
  componentDidMount() {
    Router.events.on('routeChangeComplete', (url) => {
      gtag.pageview(url);
      window.scrollTo(0, 0);
    });
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <SharesCountProvider>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </SharesCountProvider>
    );
  }
}

export default EntourageApp;
