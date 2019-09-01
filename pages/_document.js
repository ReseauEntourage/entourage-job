import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

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
          <NextScript />
          <script src="/static/dist/js/uikit.js" />
          <script src="/static/dist/js/uikit-icons.js" />
        </body>
      </html>
    );
  }
}
