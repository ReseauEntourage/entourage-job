// import '../assets/uikit/dist/css/uikit.css';
import '../dist/css/uikit.css';

import React from 'react';
import Head from 'next/head';
import App, { Container } from 'next/app';
import Header from '../components/Header';
import Footer from '../components/Footer';

class MyApp extends App {
  links = [
    { href: '/jeveuxaider', name: 'aider' },
    { href: '/jeveuxtravailler', name: 'travailler' },
    { href: '/jeveuxrecruter', name: 'recruter' },
  ];

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Head>
          <title>Entourage Jobs</title>
        </Head>
        <Header items={this.links} />
        <Component {...pageProps} />
        <Footer items={this.links} />
      </Container>
    );
  }
}

export default MyApp;
