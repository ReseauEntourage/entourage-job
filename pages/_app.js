import '../static/dist/css/uikit.entourage.css';

import React from 'react';
import App, { Container } from 'next/app';
import Header from '../components/Header';
import Footer from '../components/Footer';

class EntourageApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </Container>
    );
  }
}

export default EntourageApp;
