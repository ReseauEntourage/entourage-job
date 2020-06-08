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

class EntourageApp extends App {
  componentDidMount() {
    Router.events.on('routeChangeComplete', (url) => gtag.pageview(url));
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    );
  }
}

export default EntourageApp;
