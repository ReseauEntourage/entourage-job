import React from 'react';
import { event } from 'src/lib/gtag';
import { Button, Grid, Img, Section } from 'src/components/utils';
import TAGS from 'src/constants/tags';
import Layout from 'src/components/Layout';
import ImageTitle from 'src/components/partials/ImageTitle';
import SearchCandidates from 'src/components/partials/SearchCandidates';
import CorporateContact from 'src/components/partials/CorporateContactPartial';
import NewsletterPartial from 'src/components/partials/NewsletterPartial';
import { IconNoSSR } from 'src/components/utils/Icon';
import { openModal } from 'src/components/modals/Modal';
import usePostPublicOfferModal from 'src/components/modals/usePostPublicOfferModal';

const CVEntreprises = () => {
  const publicOfferModal = usePostPublicOfferModal();

  return (
    <Layout title="CVs Entreprises - LinkedOut">
      <ImageTitle
        img="/static/img/header_pic_cvs.jpg"
        id="companies-title"
        title={
          <span>
            <span className="uk-text-primary">Ils sont prêts</span>{' '}
            <span> à travailler&nbsp;!</span>
          </span>
        }
      />
      <SearchCandidates style="muted" />
      <Section style="default">
        <div className="uk-flex uk-flex-middle uk-flex-center uk-flex-column">
          <h3 className="uk-text-bold uk-margin-medium-bottom">
            Votre offre peut correspondre{' '}
            <span className="uk-text-primary">à plusieurs profils&nbsp;?</span>
          </h3>
          <div className="uk-height-medium">
            <Img
              style={{ height: '100%' }}
              src="/static/img/new_candidates.jpg"
              alt="Visages LinkedOut"
            />
          </div>
          <Grid middle column gap="collapse">
            <Button
              className="uk-margin-medium-top"
              style="secondary"
              onClick={() => {
                event(TAGS.PAGE_RECRUTER_DEPOSER_OFFRE_CLIC);
                openModal(publicOfferModal);
              }}
            >
              Déposez votre offre <IconNoSSR name="chevron-right" />
            </Button>
          </Grid>
        </div>
        <hr className="uk-margin-large-top uk-margin-large-bottom" />
        <div className="uk-flex uk-flex-middle uk-flex-center uk-flex-column">
          <h3 className="uk-text-bold">
            Vous n&apos;avez pas trouvé{' '}
            <span className="uk-text-primary">
              le profil correspondant&nbsp;?
            </span>
          </h3>
          <h4>
            D&apos;autres partenaires pourraient vous orienter des
            personnes&nbsp;!
          </h4>
          <Grid middle column gap="collapse">
            <Button
              className="uk-margin-medium-top"
              style="secondary"
              href="/entreprises/recruter-hors-linkedout"
            >
              Voir les partenaires&nbsp;
              <IconNoSSR name="chevron-right" />
            </Button>
          </Grid>
        </div>
      </Section>
      <CorporateContact />
      <NewsletterPartial style="default" />
    </Layout>
  );
};

export default CVEntreprises;
