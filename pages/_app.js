import '../static/dist/css/uikit.css';

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
        </Head>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </Container>
    );
  }
}

export default EntourageApp;
