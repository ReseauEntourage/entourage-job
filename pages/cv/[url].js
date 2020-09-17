import React, {useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import {
  DiscoverPartial,
  ContactPartial,
  ActionPartial,
} from '../../components/partials';
import { CVBackground, CVFiche } from '../../components/cv';
import Layout from '../../components/Layout';
import Api from '../../Axios';
import {GridNoSSR, Section} from '../../components/utils';
import {SharesCountContext} from "../../components/store/SharesCountProvider";

const CVPage = ({ cv, router }) => {

  const { incrementSharesCount } = useContext(SharesCountContext);

  const updateShareCount = (candidatId, type) => {
    Api.post('api/v1/cv/count', {
      candidatId, type
    }).then(() => {
      incrementSharesCount();
    }).catch((e) => {
      console.log(e);
    })
  };

  useEffect(() => {
    if(!document.referrer || !document.referrer.includes(window.location.origin)) {
      updateShareCount(cv.UserId, 'other');
    }
  }, []);

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
        <ContactPartial submitLabel="Écrivez-moi" />
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
              '.jpg',
              '.preview.jpg'
            )}`
          : `${process.env.SERVER_URL}/static/img/linkedout-preview.jpg`
      }
      metaType="profile"
    >
      <div className="uk-background-muted">
        {cv.urlImg && (
          <CVBackground employed={cv.user ? cv.user.employed : false} url={process.env.AWSS3_URL + cv.urlImg || undefined} />
        )}
        <CVFiche cv={cv} />
        <ActionPartial style="muted" />
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
