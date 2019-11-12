import '../static/dist/css/uikit.entourage.css';

import React from 'react';
import App from 'next/app';
import UserProvider from '../components/UserProvider';

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
