import '../static/dist/css/uikit.entourage.css';

import React from 'react';
import App from 'next/app';

class EntourageApp extends App {
  // static async getInitialProps(
  //   { Component, ctx }
  //   ) {
  //   let pageProps = {};
  //   console.log('context session : ', ctx.req.session);

  //   if (Component.getInitialProps) {
  //     pageProps = await Component.getInitialProps(ctx);
  //   }
  //   if (ctx.req && ctx.req.session.passport) {
  //     pageProps.user = ctx.req.session.passport.user;
  //   }
  //   return { pageProps };
  // }

  render() {
    const { Component, pageProps } = this.props;

    return <Component {...pageProps} />;
  }
}

export default EntourageApp;
