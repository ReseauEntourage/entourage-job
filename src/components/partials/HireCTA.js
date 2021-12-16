import React from 'react';
import { Button, Grid, Section, Img } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';

import CVList from 'src/components/cv/CVList';
import { event } from 'src/lib/gtag';
import TAGS from 'src/constants/tags';
import { CV_FILTERS_DATA } from 'src/constants';
import { openModal } from 'src/components/modals/Modal';
import usePostPublicOfferModal from 'src/components/modals/usePostPublicOfferModal';

const HireCTA = () => {
  const publicOfferModal = usePostPublicOfferModal();

  return (
    <Section style="muted">
      <div className="uk-margin-medium-bottom">
        <h2 className="uk-text-center uk-text-bold">
          Prêts à diffuser{' '}
          <span className="uk-text-primary">
            votre offre d&apos;emploi&nbsp;?
          </span>
        </h2>
        <h4 className="uk-text-center uk-margin-remove-top">
          Deux solutions s&apos;offrent à vous
        </h4>
        <div className="uk-flex uk-flex-column">
          <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-margin-medium-top uk-margin-medium-bottom">
            <div className="uk-flex uk-flex-middle uk-flex-center uk-padding uk-padding-remove-vertical uk-container-small">
              <div
                className="uk-flex uk-flex-top uk-text-bold uk-text-primary uk-text-large uk-margin-small-right uk-text-nowrap"
                style={{ fontSize: 36, lineHeight: 1 }}
              >
                1.&nbsp;
              </div>
              <h4 className="uk-text-bold uk-margin-remove">
                Découvrez ci-dessous les CV des candidats LinkedOut disponibles,
                et envoyez votre offre au profil qui correspond à votre besoin
                de recrutement
              </h4>
            </div>
          </div>
          <CVList
            hideSearchBar
            nb={3}
            filters={{
              [CV_FILTERS_DATA[0].key]: CV_FILTERS_DATA[0].constants,
            }}
          />
          <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
            <div className="uk-container-small uk-flex uk-flex-center">
              <p className="uk-text-center uk-margin-medium-top">
                Les candidats disponibles recherchent majoritairement dans les
                métiers à premier niveau de qualification
                <br /> et sont situés en Île&#8209;de&#8209;France.
              </p>
            </div>
            <Grid middle column gap="collapse">
              <Button
                href="/entreprises/cvs"
                style="secondary"
                className="uk-margin-small-top"
              >
                Découvrez tous les CV&nbsp;
                <IconNoSSR name="chevron-right" />
              </Button>
            </Grid>
            <hr className="uk-margin-large-top uk-width-1-1" />
            <div className="uk-flex uk-flex-middle uk-flex-center uk-padding">
              <div
                className="uk-flex uk-flex-top uk-text-bold uk-text-primary uk-text-large uk-margin-small-right uk-text-nowrap"
                style={{ fontSize: 36, lineHeight: 1 }}
              >
                2.&nbsp;
              </div>
              <h4 className="uk-text-bold uk-margin-remove">
                Votre offre peut correspondre à plusieurs profils&nbsp;?
              </h4>
            </div>
            <Img src="/static/img/new_candidates.jpg" alt="Visages LinkedOut" />
            <Grid middle column gap="collapse">
              <Button
                className="uk-margin-medium-top"
                style="secondary"
                onClick={() => {
                  event(TAGS.PAGE_RECRUTER_DEPOSER_OFFRE_CLIC);
                  openModal(publicOfferModal);
                }}
              >
                Déposez votre offre&nbsp;
                <IconNoSSR name="chevron-right" />
              </Button>
            </Grid>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default HireCTA;
