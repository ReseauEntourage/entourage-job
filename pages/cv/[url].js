import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { DiscoverPartial, ContactPartial } from '../../components/partials';
import { CVBackground, CVFiche } from '../../components/cv';
import Layout from '../../components/Layout';
import Api from '../../Axios';
import { Section } from '../../components/utils';

const CVPage = ({ cv, router }) => {
  if (!cv) {
    return (
      <Layout title="Page introuvable - LinkedOut">
        <Section className="uk-text-center" size="large">
          <h2>Ce profil n’est pas disponible</h2>
          <p>
            Le lien que vous avez suivi est peut-être rompu, ou la page a été
            supprimée.
          </p>
        </Section>
        <ContactPartial />
        <DiscoverPartial />
      </Layout>
    );
  }

  const name =
    cv.firstName.charAt(0).toUpperCase() + cv.firstName.slice(1).toLowerCase();
  return (
    <Layout
      title={`${name} - LinkedOut`}
      metaTitle={`Aidez ${name} en partageant son CV.`}
      metaUrl={`${process.env.SERVER_URL}${router.asPath}`}
      metaDescription={cv.intro}
      metaImage={`${process.env.SERVER_URL}/static/img/cv/${cv.url}-preview.jpg`}
      metaType="profile"
    >
      <CVBackground url="/static/img/arthur-background.jpg" />
      <CVFiche cv={cv} />
      <ContactPartial />
      <DiscoverPartial />
    </Layout>
  );
};
CVPage.getInitialProps = async ({ query }) => {
  const res = await Api.get(`${process.env.SERVER_URL}/api/v1/cv/${query.url}`);
  const data = await res.data;
  return { cv: data };
};
CVPage.propTypes = {
  cv: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    intro: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  router: PropTypes.shape({
    asPath: PropTypes.string.isRequired,
  }),
};
CVPage.defaultProps = {
  cv: null,
  router: {
    asPath: '',
  },
};

export default withRouter(CVPage);
