import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Layout from 'src/components/Layout';
import Api from 'src/Axios';
import { Section } from 'src/components/utils';
import CVPDF from 'src/components/cv/CVPDF';

const CVPDFPage = ({ cv, page, router }) => {
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
      metaDescription={cv.story}
      metaImage={
        cv.urlImg
          ? `${process.env.AWSS3_URL}${cv.urlImg.replace(
              '.jpg',
              '.preview.jpg'
            )}`
          : `${process.env.SERVER_URL}/static/img/linkedout-preview-new.jpg`
      }
      metaType="profile"
    >
      <div className="uk-background-muted">
        <CVPDF cv={cv} page={page} />
      </div>
    </Layout>
  );
};

CVPDFPage.getInitialProps = async ({ query }) => {
  if (query.token) {
    return Api.get(`${process.env.SERVER_URL}/api/v1/cv/`, {
      params: {
        userId: query.id,
      },
      headers: {
        authorization: `Token ${query.token}`,
      },
    })
      .then(({ data }) => {
        return { cv: data, page: query.page };
      })
      .catch((err) => {
        console.log(err);
        return { cv: null };
      });
  }
  console.log('No token provided');
  return { cv: null };
};
CVPDFPage.propTypes = {
  cv: PropTypes.shape(),
  page: PropTypes.number,
  router: PropTypes.shape(),
};
CVPDFPage.defaultProps = {
  cv: null,
  page: null,
  router: {
    asPath: '',
  },
};

export default withRouter(CVPDFPage);
