/* eslint-disable react/jsx-props-no-spreading */
import '../static/dist/css/uikit.entourage.css';
import '../static/css/styles.less';
import '../static/css/Forms.less';
import '../static/css/Toggle.less';

import React from 'react';
import App from 'next/app';
import UserProvider from '../components/store/UserProvider';

class EntourageApp extends App {
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
