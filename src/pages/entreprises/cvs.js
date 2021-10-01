import React from 'react';
import { event } from 'src/lib/gtag';
import { Button, Grid, Icon, Section } from 'src/components/utils';
import PostJobAdModal, { modalId } from 'src/components/modals/PostJobAdModal';
import TAGS from 'src/constants/tags';
import Layout from 'src/components/Layout';
import ImageTitle from 'src/components/partials/ImageTitle';
import SearchCandidates from 'src/components/partials/SearchCandidates';
import CorporateContact from 'src/components/partials/CorporateContactPartial';
import CorporateNewsletter from 'src/components/partials/CorporateNewsletterPartial';

const CVEntreprises = () => {
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
      <SearchCandidates style="muted" defaultHideEmployed isCompany />
      <Section style="default">
        <div className="uk-flex uk-flex-middle uk-flex-center uk-flex-column">
          <h3 className="uk-text-bold uk-margin-medium-bottom">
            Votre offre peut correspondre{' '}
            <span className="uk-text-primary">à plusieurs profils&nbsp;?</span>
          </h3>
          <div className="uk-height-medium">
            <img
              style={{ height: '100%' }}
              src="/static/img/new_candidates.jpg"
              alt="Visages LinkedOut"
            />
          </div>
          <Grid middle column gap="collapse">
            <Button
              className="uk-margin-medium-top"
              style="secondary"
              toggle={`target: #${modalId}`}
              onClick={() => {
                return event(TAGS.PAGE_RECRUTER_DEPOSER_OFFRE_CLIC);
              }}
            >
              Déposez votre offre <Icon name="chevron-right" />
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
              <Icon name="chevron-right" />
            </Button>
          </Grid>
        </div>
      </Section>
      <PostJobAdModal />
      <CorporateContact />
      <CorporateNewsletter style="default" />
    </Layout>
  );
};

export default CVEntreprises;
