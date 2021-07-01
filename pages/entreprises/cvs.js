import React from 'react';
import { event } from '../../lib/gtag';
import { Button, GridNoSSR, IconNoSSR, Section } from '../../components/utils';
import PostJobAdModal, {
  modalId,
} from '../../components/modals/PostJobAdModal';
import TAGS from '../../constants/tags';
import Layout from '../../components/Layout';
import ImageTitle from '../../components/sections/ImageTitle';
import SearchCandidates from '../../components/partials/SearchCandidates';
import CorporateContact from '../../components/partials/CorporateContactPartial';
import CorporateNewsletter from '../../components/partials/CorporateNewsletterPartial';

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
      <SearchCandidates style="muted" defaultHideEmployed />
      <Section style="default">
        <div className="uk-flex uk-flex-middle uk-flex-center">
          <h4 className="uk-text-bold uk-margin-remove">
            Votre offre peut correspondre à plusieurs profils&nbsp;?
          </h4>
        </div>
        <GridNoSSR middle column gap="collapse">
          <Button
            className="uk-margin-medium-top"
            style="secondary"
            toggle={`target: #${modalId}`}
            onClick={() => {
              return event(TAGS.PAGE_RECRUTER_DEPOSER_OFFRE_CLIC);
            }}
          >
            Déposer mon offre <IconNoSSR name="chevron-right" />
          </Button>
        </GridNoSSR>
      </Section>
      <PostJobAdModal />
      <CorporateContact />
      <CorporateNewsletter style="default" />
    </Layout>
  );
};

export default CVEntreprises;
