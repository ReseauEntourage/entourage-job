import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import {
  DiscoverPartial,
  ContactPartial,
  ActionPartial,
  SharePartial,
} from '../../components/partials';
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

  return (
    <Layout
      title={`${cv.user.candidat.firstName} - LinkedOut`}
      metaTitle={`Aidez ${cv.user.candidat.firstName} en partageant son CV.`}
      metaUrl={`${process.env.SERVER_URL}${router.asPath}`}
      metaDescription={cv.intro}
      metaImage={
        cv.urlImg
          ? `${process.env.AWSS3_URL}${cv.urlImg.replace(
              '.webp',
              '.preview.jpg'
            )}`
          : `${process.env.SERVER_URL}/static/img/cv/arthur-preview-preview.jpg`
      }
      metaType="profile"
    >
      <div className="uk-background-muted">
        {cv.urlImg && (
          <CVBackground url={process.env.AWSS3_URL + cv.urlImg || undefined} />
        )}
        <CVFiche cv={cv} />
        {/* <DiscoverPartial />  */}
        <ActionPartial />
        <ContactPartial />
        <SharePartial />
      </div>
    </Layout>
  );
};
CVPage.getInitialProps = async ({ query }) => {
  return Api.get(`${process.env.SERVER_URL}/api/v1/cv/${query.url}`)
    .then(({ data }) => {
      return { cv: data };
    })
    .catch((err) => {
      console.log(err);
      return { cv: null };
    });
};
CVPage.propTypes = {
  cv: PropTypes.shape(),
  router: PropTypes.shape(),
};
CVPage.defaultProps = {
  cv: null,
  router: {
    asPath: '',
  },
};

export default withRouter(CVPage);
