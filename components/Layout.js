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
  metaType,
}) => (
  <Container>
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:type" content={metaType} />
      <meta property="og:url" content={metaUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:site" content="@R_Entourage" />
      <meta name="twitter:image" content={metaImage} />
      {/* <meta name="fb:app_id" content="" /> */}
    </Head>
    <Header />
    {children}
    <Footer />
  </Container>
);
Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  title: PropTypes.string,
  metaTitle: PropTypes.string,
  metaImage: PropTypes.string,
  metaDescription: PropTypes.string,
  metaUrl: PropTypes.string,
  metaType: PropTypes.string,
};
Layout.defaultProps = {
  title: 'Entourage Jobs',
  metaTitle:
    'Faites don de votre visibilité avec LinkedOut. Un partage peut tout changer.',
  metaImage: '/static/img/entouragejobs-preview.jpg',
  metaDescription:
    "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer. @Réseau Entourage",
  metaUrl: 'https://entourage-job-preprod.herokuapp.com/',
  metaType: 'website',
};
export default Layout;
