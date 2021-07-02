import React from 'react';
import { Button, GridNoSSR, IconNoSSR, Section } from '../utils';

import './HireCTA.less';
import CVList from '../cv/CVList';
import PostJobAdModal, { modalId } from '../modals/PostJobAdModal';
import { event } from '../../lib/gtag';
import TAGS from '../../constants/tags';

const HireCTA = () => {
  return (
    <Section>
      <div className="uk-margin-medium-bottom">
        <h2 className="uk-text-center uk-text-bold">
          Prêts à balancer{' '}
          <span className="uk-text-primary">votre offre&nbsp;?</span>
        </h2>
        <div className="uk-flex uk-flex-column">
          <div className="uk-container-small">
            <h4 className="uk-text-left uk-align-left uk-margin-medium-top uk-margin-large-left">
              Deux solutions&nbsp;:
            </h4>
          </div>
          <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
            <div className="uk-flex uk-flex-middle uk-flex-center uk-padding uk-container-small">
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
          <CVList nb={3} hideEmployed />
          <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
            <div className="uk-container-small uk-flex uk-flex-center">
              <p className="uk-text-italic uk-text-muted uk-text-center uk-margin-medium-top">
                Les candidats disponibles recherchent majoritairement dans les
                métiers à premier niveau de qualification et sont situés en
                Île-de-France.
              </p>
            </div>
            <GridNoSSR middle column gap="collapse">
              <Button
                href="/entreprises/cvs"
                style="secondary"
                className="uk-margin-small-top"
              >
                Découvrez tous les CV <IconNoSSR name="chevron-right" />
              </Button>
            </GridNoSSR>
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
            <GridNoSSR middle column gap="collapse">
              <Button
                style="secondary"
                toggle={`target: #${modalId}`}
                onClick={() => {
                  return event(TAGS.PAGE_RECRUTER_DEPOSER_OFFRE_CLIC);
                }}
              >
                Déposez votre offre <IconNoSSR name="chevron-right" />
              </Button>
            </GridNoSSR>
            <PostJobAdModal />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default HireCTA;
