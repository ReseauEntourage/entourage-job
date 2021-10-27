import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import {
  ActionPartial,
  DiscoverPartial,
  NewsletterPartial,
} from 'src/components/partials';
import { CVBackground, CVFiche } from 'src/components/cv';
import Layout from 'src/components/Layout';
import Api from 'src/Axios';
import { Grid, Section, SimpleLink } from 'src/components/utils';
import TAGS from 'src/constants/tags';
import { useUpdateSharesCount } from 'src/hooks';
import Button from 'src/components/utils/Button';
import { CV_FILTERS_DATA } from 'src/constants';
import CVList from 'src/components/cv/CVList';
import { IconNoSSR } from 'src/components/utils/Icon';

const CVPage = ({ cv, exists, router, hideShareOptions }) => {
  const updateSharesCount = useUpdateSharesCount();

  const hostname = process.env.SERVER_URL;
  const link = `${hostname}${router.asPath}`;
  const candidateExists = cv && cv.user && cv.user.candidat;
  const sharedDescription = candidateExists
    ? `La précarité n'exclut pas les compétences\xa0! Avec LinkedOut, aidons ${cv.user.candidat.firstName} à retrouver un emploi en lui proposant un job ou en diffusant son CV\xa0!`
    : '';
  const title = candidateExists
    ? `LinkedOut\xa0: Aidez ${cv.user.candidat.firstName} à retrouver un emploi`
    : '';

  useEffect(() => {
    if (cv) {
      updateSharesCount(cv.UserId, 'other');
    }
  }, [cv, updateSharesCount]);

  if (!cv) {
    if (exists) {
      return (
        <Layout title="Bonne nouvelle ! - LinkedOut" noIndex>
          <Section className="uk-text-center" style="default">
            <h2 className="uk-text-bold">
              C&apos;est une{' '}
              <span className="uk-text-bold uk-text-primary">
                bonne nouvelle&nbsp;!
              </span>{' '}
            </h2>
            <h4>
              Ce candidat est actuellement{' '}
              <span className="uk-text-bold">en emploi ou a été réorienté</span>
              .
            </h4>
            <h4 className="uk-margin-medium-bottom">
              Soutenez un autre candidat&nbsp;:
              <SimpleLink href="/candidats" className="uk-text-bold">
                {' '}
                partagez son CV&nbsp;!
              </SimpleLink>
            </h4>
            <CVList
              nb={3}
              filters={{
                [CV_FILTERS_DATA[0].key]: CV_FILTERS_DATA[0].constants,
              }}
            />
            <Grid middle column gap="collapse">
              <Button
                href="/candidats"
                style="secondary"
                className="uk-margin-large-top"
              >
                Voir tous les candidats <IconNoSSR name="chevron-right" />
              </Button>
            </Grid>
          </Section>
          <Section style="muted">
            <NewsletterPartial tag={TAGS.PAGE_CV_INSCRIPTION_NEWSLETTER_CLIC} />
          </Section>
        </Layout>
      );
    }
    return (
      <Layout title="Page introuvable - LinkedOut" noIndex>
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
            endOfContract={cv?.user?.endOfContract}
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
    .then(({ data: { cv, exists } }) => {
      return {
        cv,
        exists,
        hideShareOptions: query.hideShareOptions === 'true',
      };
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
  exists: PropTypes.bool,
};
CVPage.defaultProps = {
  cv: null,
  exists: true,
  hideShareOptions: false,
  router: {
    asPath: '',
  },
};

export default withRouter(CVPage);
