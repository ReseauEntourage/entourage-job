import '../static/dist/css/uikit.entourage.css';

import React from 'react';
import Head from 'next/head';
import App, { Container } from 'next/app';
import Header from '../components/Header';
import Footer from '../components/Footer';

class EntourageApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Head>
          <title>Entourage Jobs</title>
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:image"
            content="https://entourage-job-preprod.herokuapp.com/static/img/entouragejobs-preview.jpg"
          />
          <meta name="twitter:title" content="Entourage Jobs" />
          <meta property="og:title" content="Entourage Jobs" />
          <meta
            property="og:image"
            content="https://entourage-job-preprod.herokuapp.com/static/img/entouragejobs-preview.jpg"
          />
          <meta
            property="og:description"
            content="Lorsqu'on est désocialisé, on devient invisible. Les chances de retrouver du travail sont très faibles. Un partage peut tout changer. Eux cherchent du travail , vous avez du réseau."
          />
          <meta
            property="og:url"
            content="https://entourage-job-preprod.herokuapp.com/"
          />
        </Head>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </Container>
    );
  }
}

export default EntourageApp;
