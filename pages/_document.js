import React from 'react';
import Document, { Html, Head, Main, Body, NextScript } from 'next/document';
import { FeaturePolyfills } from '@engineerapart/nextscript';

// const features = [
//   FeaturePolyfills.FETCH,
//   FeaturePolyfills.CUSTOMEVENT,
//   FeaturePolyfills.INTERSECTIONOBSERVER,
//   FeaturePolyfills.OBJECT_ASSIGN,
//   FeaturePolyfills.ARRAY_FIND,
//   FeaturePolyfills.ARRAY_FINDINDEX,
//   FeaturePolyfills.ARRAY_FILL,
//   FeaturePolyfills.ARRAY_FROM,
//   FeaturePolyfills.ARRAY_INCLUDES,
//   FeaturePolyfills.REQUESTANIMATIONFRAME,
// ];

export default class MyDocument extends Document {
  // static async getInitialProps(ctx) {
  //   const initialProps = await Document.getInitialProps(ctx);
  //   return { ...initialProps };
  // }

  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        // useful for wrapping the whole react tree
        enhanceApp: (App) => App,
        // useful for wrapping in a per-page basis
        enhanceComponent: (Component) => Component,
      });

    // Run the parent `getInitialProps` using `ctx` that now includes our custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <html lang="fr">
        <Head />
        <body>
          <Main />
          <NextScript
          // allowUserMonitoring={false}
          // preloadPolyfills={false}
          // features={features}
          // preLoadScripts={[
          //   { src: '/static/dist/js/uikit.js' },
          //   { src: '/static/dist/js/uikit-icons.js' },
          // ]}
          />
          <script src="/static/dist/js/uikit.js" />
          <script src="/static/dist/js/uikit-icons.js" />
          {/*
           <link
            rel="preload"
            href="/static/dist/js/uikit-icons.js"
            as="script"
          />
          <link rel="preload" href="/static/dist/js/uikit.js" as="script" /> */}
        </body>
      </html>
    );
  }
}
