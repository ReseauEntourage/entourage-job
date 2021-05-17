import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import {
  DiscoverPartial,
  NewsletterPartial,
  ActionPartial,
} from '../../components/partials';
import { CVBackground, CVFiche } from '../../components/cv';
import Layout from '../../components/Layout';
import Api from '../../Axios';
import { Section } from '../../components/utils';
import { SessionContext } from '../../components/store/SessionProvider';
import TAGS from '../../constants/tags';

const CVPage = ({ cv, router, hideShareOptions }) => {
  const hostname = process.env.SERVER_URL;
  const link = `${hostname}${router.asPath}`;
  const candidateExists = cv && cv.user && cv.user.candidat;
  const sharedDescription = candidateExists
    ? `La précarité n'exclut pas les compétences\xa0! Avec LinkedOut, aidons ${cv.user.candidat.firstName} à retrouver un emploi en lui proposant un job ou en diffusant son CV\xa0!`
    : '';
  const title = candidateExists
    ? `LinkedOut\xa0: Aidez ${cv.user.candidat.firstName} à retrouver un emploi`
    : '';

  const { isFirstLoad } = useContext(SessionContext);

  useEffect(() => {
    if (
      isFirstLoad &&
      ((document.referrer &&
        !document.referrer.includes(window.location.origin)) ||
        !document.referrer)
    ) {
      // updateShareCount(cv.UserId, 'other');
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
        <NewsletterPartial tag={TAGS.PAGE_CV_INSCRIPTION_NEWSLETTER_CLIC} />
        <DiscoverPartial />
      </Layout>
    );
  }

  return (
    <Layout
      title={title}
      metaTitle={title}
      metaUrl={link}
      metaDescription={sharedDescription}
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
        {cv.urlImg && (
          <CVBackground
            employed={cv.user ? cv.user.employed : false}
            url={process.env.AWSS3_URL + cv.urlImg || undefined}
          />
        )}
        <CVFiche cv={cv} hideShareOptions={hideShareOptions} />
        <ActionPartial style="muted" />
      </div>
    </Layout>
  );
};

CVPage.getInitialProps = async ({ query }) => {
  return Api.get(`${process.env.SERVER_URL}/api/v1/cv/${query.url}`)
    .then(({ data }) => {
      return { cv: data, hideShareOptions: query.hideShareOptions === 'true' };
    })
    .catch((err) => {
      console.log(err);
      return { cv: null };
    });
};
CVPage.propTypes = {
  cv: PropTypes.shape(),
  hideShareOptions: PropTypes.bool,
  router: PropTypes.shape(),
};
CVPage.defaultProps = {
  cv: null,
  hideShareOptions: false,
  router: {
    asPath: '',
  },
};

export default withRouter(CVPage);
