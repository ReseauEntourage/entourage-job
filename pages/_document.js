/* eslint-disable react/no-danger */
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { addPrefix } from '../utils';

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="fr">
        <Head>
          {/* Google Analytics  */}
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
          {/* Google Tag Manager  */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.GTM_TRACKING_ID}');
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src={addPrefix('/static/dist/js/uikit.js')} />
          <script src={addPrefix('/static/dist/js/uikit-icons.js')} />
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              title="Google Tag Manager"
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.GTM_TRACKING_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </body>
      </html>
    );
  }
}
