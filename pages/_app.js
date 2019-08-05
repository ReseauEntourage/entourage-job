import 'uikit/dist/css/uikit.css';

import React from 'react';
import Head from 'next/head';
import App, { Container } from 'next/app';
import Header from '../components/Header';
import Footer from '../components/Footer';

class MyApp extends App {
  links = [
    { href: '/jeveuxaider', name: 'Je veux aider' },
    { href: '/jeveuxtravailler', name: 'Je veux travailler' },
    { href: '/jeveuxrecruter', name: 'Je veux recruter' },
  ];

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

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
