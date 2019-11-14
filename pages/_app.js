import '../static/dist/css/uikit.entourage.css';
import '../static/css/Forms.less';

import React from 'react';
import App from 'next/app';

class EntourageApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}

export default EntourageApp;
