/* eslint-disable react/no-danger */
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
// import ReactGA from 'react-ga';

export default class MyDocument extends Document {
  // static gaTrackingID = 'UA-148738107-1';

  // gaInitialized = false;

  // asPath = '';

  // static initializeReactGA() {
  //   ReactGA.initialize(this.gaTrackingID);
  //   ReactGA.pageview(this.asPath);
  // }

  // static logPageView = () => {
  //   // console.log(`Logging pageview for ${this.asPath}`);
  //   ReactGA.set({ page: this.asPath });
  //   ReactGA.pageview(this.asPath);
  // };

  // static async getInitialProps(ctx) {
  //   // Check if in production
  //   const isProduction = process.env.NODE_ENV === 'production';
  //   const initialProps = await Document.getInitialProps(ctx);
  //   // GA
  //   this.asPath = ctx.asPath;
  //   if (!MyDocument.gaInitialized) {
  //     MyDocument.initializeReactGA();
  //     this.gaInitialized = true;
  //   }
  //   MyDocument.logPageView();
  //   // Pass isProduction flag back through props
  //   return { ...initialProps, isProduction };
  // }

  render() {
    return (
      <html lang="fr">
        <Head>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </Head>
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
