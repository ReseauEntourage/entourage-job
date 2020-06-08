import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Footer from './Footer';
import Header from './headers/Header';
import HeaderConnected from './headers/HeaderConnected';
import { UserContext } from './store/UserProvider';
import ModalShareCV from './modals/ModalShareCV';

const Layout = ({
  children,
  title,
  metaTitle,
  metaImage,
  metaDescription,
  metaUrl,
  metaType,
  router,
}) => (
  <>
    <Head>
      <title>{title}</title>
      <link rel="icon" type="image/png" href="/static/img/fav.png" />
      <meta name="title" property="og:title" content={metaTitle} />
      <meta
        name="description"
        property="og:description"
        content={metaDescription}
      />
      <meta name="image" property="og:image" content={metaImage} />
      <meta property="og:type" content={metaType} />
      <meta property="og:url" content={metaUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:site" content="@R_Entourage" />
      <meta name="twitter:image" content={metaImage} />
      {/* <meta name="fb:app_id" content="" /> */}
    </Head>
    <UserContext.Consumer>
      {({ isAuthentificated }) =>
        isAuthentificated &&
        router.asPath !== '/jeveuxaider' &&
        router.asPath !== '/jeveuxtravailler' &&
        router.asPath !== '/jeveuxrecruter' &&
        router.asPath !== '/lescandidats' &&
        router.asPath !== '/contact' ? (
          <HeaderConnected />
        ) : (
          router.asPath !== '/' && <Header isHome={false} />
        )
      }
    </UserContext.Consumer>
    {children}
    <Footer />
  </>
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
  router: PropTypes.shape({
    asPath: PropTypes.string,
  }).isRequired,
};
Layout.defaultProps = {
  title: 'LinkedOut',
  metaTitle:
    'Faites don de votre visibilité avec LinkedOut. Un partage peut tout changer.',
  metaImage: `${process.env.SERVER_URL}/static/img/entouragejobs-preview.jpg`,
  metaDescription:
    "Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer. @Réseau Entourage",
  metaUrl: process.env.SERVER_URL,
  metaType: 'website',
};
export default withRouter(Layout);
