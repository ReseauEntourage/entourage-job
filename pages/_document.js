import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
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
