import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Layout from '../../../components/Layout';
import Api from '../../../Axios';
import {Section} from '../../../components/utils';
import CVPDF from "../../../components/cv/CVPDF";

const CVPDFPage = ({ cv, router }) => {
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
              '.jpg',
              '.preview.jpg'
            )}`
          : `${process.env.SERVER_URL}/static/img/linkedout-preview.jpg`
      }
      metaType="profile"
    >
      <div className="uk-background-muted">
        <CVPDF cv={cv}/>
      </div>
    </Layout>
  );
};

CVPDFPage.getInitialProps = async ({ query }) => {
  return Api.get(`${process.env.SERVER_URL}/api/v1/cv/${query.url}`)
    .then(({ data }) => {
      return { cv: data };
    })
    .catch((err) => {
      console.log(err);
      return { cv: null };
    });
};
CVPDFPage.propTypes = {
  cv: PropTypes.shape(),
  router: PropTypes.shape(),
};
CVPDFPage.defaultProps = {
  cv: null,
  router: {
    asPath: '',
  },
};

export default withRouter(CVPDFPage);
