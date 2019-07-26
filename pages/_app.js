import React from 'react';
import Head from 'next/head';
import App, { Container } from 'next/app';
import Link from 'next/link';
import "uikit/dist/css/uikit.css";

class MyApp extends App {
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
        <nav className="uk-navbar-container" data-uk-navbar>
          <div className="uk-navbar-right">
            <ul className="uk-navbar-nav">
              <li><Link href="/jeveuxaider" as="je-veux-aider"><a>Je veux aider</a></Link></li>
              <li><Link href="/jeveuxtravailler" as="je-veux-travailler"><a title="Je veux travailler">Je veux travailler</a></Link></li>
              <li><Link href="/jeveuxrecruter" as="je-veux-recruter"><a title="test">Je veux recruter</a></Link></li>
            </ul>
            <button className="uk-button uk-button-default">Partager l'opération</button>
          </div>
        </nav>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default MyApp;