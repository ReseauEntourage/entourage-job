import React from 'react';
import Head from 'next/head';
import { Container } from 'next/app';
import PropTypes from 'prop-types';
import Footer from './Footer';
import Header from './Header';

const Layout = ({
  children,
  title,
  metaTitle,
  metaImage,
  metaDescription,
  metaUrl,
}) => (
  <Container>
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content={metaImage} />
    </Head>
    <Header />
    {children}
    <Footer />
  </Container>
);
Layout.propTypes = {
  children: PropTypes.element.isRequired,
  title: PropTypes.string,
  metaTitle: PropTypes.string,
  metaImage: PropTypes.string,
  metaDescription: PropTypes.string,
  metaUrl: PropTypes.string,
};
Layout.defaultProps = {
  title: 'Entourage Jobs',
  metaTitle: 'Entourage Jobs',
  metaImage:
    'https://entourage-job-preprod.herokuapp.com/static/img/entouragejobs-preview.jpg',
  metaDescription:
    "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer. @Réseau Entourage",
  metaUrl: 'https://entourage-job-preprod.herokuapp.com/',
};
export default Layout;
