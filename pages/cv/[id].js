import React from 'react';
import PropTypes from 'prop-types';
// import { useRouter } from 'next/router';
import Head from 'next/head';
// import Link from 'next/link';
import { DiscovertPartial, ContactPartial } from '../../components/partials';
import { CVBackground, CVFiche } from '../../components/cards';
import Layout from '../../components/Layout';

const CV = ({ query: { id }, asPath }) => {
  // const router = useRouter();
  // Probleme: Je n'utilise pas ça car il y a un probleme avec l'appel de query
  // Lors de l'affichage, il appel 2 fois la page. La premiere ne contient pas d'information: id = undefined
  // La seconde est correct. Cela créé un probleme pour la recuperation de la page par le partage (exemple pour linkedin qui recupere id = undefined)
  // Objectif: const { id } = router.query;
  // Bidouille: recupération de l'id selon le format "/cv/[id]"
  // const id = 'arthur';
  const hostname = 'https://entourage-job-preprod.herokuapp.com';
  const backgroundCV = '/static/img/arthur-background.jpg';
  return (
    <Layout
      title={`${id} - Entourage Jobs`}
      metaTitle={`${id} - Entourage Jobs`}
      metaUrl={`${hostname}${asPath}`}
      metaDescription="Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer. @Réseau Entourage"
      metaImage={`${hostname}/static/img/arthur.png`}
    >
      <Head>
        {/* <meta name="og:type" content="profile" /> */}
        <meta property="profile:username" content={id} />
      </Head>
      <div style={{ position: 'relative' }}>
        <CVBackground url={backgroundCV} />
        <CVFiche id={id} />
        <ContactPartial />
        <DiscovertPartial />
      </div>
    </Layout>
  );
};

CV.getInitialProps = ({ query, asPath }) => {
  return { query, asPath };
};

CV.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  asPath: PropTypes.string.isRequired,
};
export default CV;
