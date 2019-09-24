import React from 'react';
import PropTypes from 'prop-types';
import { DiscovertPartial, ContactPartial } from '../../components/partials';
import { CVBackground, CVFiche } from '../../components/cards';
import Layout from '../../components/Layout';

const CV = ({ query: { id }, asPath }) => {
  const hashtags = [];
  const hostname = 'https://entourage-job-preprod.herokuapp.com';
  const backgroundCV = '/static/img/arthur-background.jpg';

  const email = `${id}@gmail.com`;
  const link = `https://entourage-job-preprod.herokuapp.com/cv/${id}`;

  const name = id.charAt(0).toUpperCase() + id.slice(1).toLowerCase();
  const sharedDescription = `Donnons un coup de pouce à ${name} en partageant son CV`;
  const title = `${name} - Entourage Jobs`;

  return (
    <Layout
      title={title}
      metaTitle={title}
      metaUrl={`${hostname}${asPath}`}
      metaDescription="Lorsque l'on est exclu, les chances de trouver du travail sont proches de zéro. Avec LinkedOut, faites don de votre visibilité. Un partage peut tout changer. @Réseau Entourage"
      metaImage={`${hostname}/static/img/arthur.png`}
      metaType="profile"
    >
      <div style={{ position: 'relative' }}>
        <CVBackground url={backgroundCV} />
        <CVFiche
          name={name}
          email={email}
          link={link}
          hashtags={hashtags}
          sharedDescription={sharedDescription}
          sharedTitle={title}
        />
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
