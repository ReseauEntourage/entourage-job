import React from 'react';
import Head from 'next/head';
import App, { Container } from 'next/app';
import Link from 'next/link';
// import ButtonShare from "../components/utils/buttons/ButtonShare.js";
import 'uikit/dist/css/uikit.css';

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
        <nav className="uk-navbar-container" data-uk-navbar id="header">
          <div className="uk-navbar-left">
            <a className="uk-navbar-item uk-logo" href="#">
              <img src="/static/img/logo-linkedout-dark.png" alt="Linkedout" width="100px" />
              <span className="uk-margin-small-left">by Entourage</span>
            </a>
          </div>
          <div className="uk-navbar-right">
            <ul className="uk-navbar-nav uk-visible@m">
              <li>
                <Link href="/jeveuxaider" as="je-veux-aider">
                  <a title="Je veux aider">Je veux aider</a>
                </Link>
              </li>
              <li>
                <Link href="/jeveuxtravailler" as="je-veux-travailler">
                  <a title="Je veux travailler">Je veux travailler</a>
                </Link>
              </li>
              <li>
                <Link href="/jeveuxrecruter" as="je-veux-recruter">
                  <a title="Je veux recruter">Je veux recruter</a>
                </Link>
              </li>
            </ul>
            <div className="uk-navbar-item uk-visible@m">
              <button className="uk-button uk-button-primary">Partager l'opération</button>
            </div>
          </div>
          <a
            className="uk-navbar-toggle uk-hidden@m"
            data-uk-navbar-toggle-icon
            href="#offcanvas"
          />
        </nav>
        <div id="offcanvas" data-uk-offcanvas="mode: push; overlay: true">
          <div className="uk-offcanvas-bar">
            <ul className="uk-nav uk-nav-default">
              <li>
                <Link href="/jeveuxaider" as="je-veux-aider">
                  <a title="Je veux aider">Je veux aider</a>
                </Link>
              </li>
              <li>
                <Link href="/jeveuxtravailler" as="je-veux-travailler">
                  <a title="Je veux travailler">Je veux travailler</a>
                </Link>
              </li>
              <li>
                <Link href="/jeveuxrecruter" as="je-veux-recruter">
                  <a title="Je veux recruter">Je veux recruter</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Component {...pageProps} />
        <div className="uk-section uk-section-secondary" id="footer">
          <div className="uk-container" />
        </div>
      </Container>
    );
  }
}

export default MyApp;
