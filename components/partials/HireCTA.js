import React from 'react';
import { Button, IconNoSSR } from '../utils';

const HireCTA = () => {
  return (
    <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
      <div className="uk-background-primary uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-flex-middle uk-padding-large uk-width-1-2@m">
        <div className="uk-light uk-flex-1">
          <h2 className="uk-text-primary uk-margin-remove uk-text-center uk-flex-center uk-flex-middle uk-text-bold uk-flex">
            Vous souhaitez recruter&nbsp;?
          </h2>
        </div>
        <div className="uk-light uk-flex-1">
          <div className="uk-text-primary uk-margin-medium-top uk-text-center">
            Recherchez le candidat qui correspond à vos besoins et proposez lui
            votre offre
          </div>
        </div>
        <div className="uk-light uk-margin-medium-top uk-flex-center uk-flex uk-flex-middle">
          <Button href="/candidats" style="secondary">
            Trouver le bon candidat LinkedOut <IconNoSSR name="chevron-right" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HireCTA;
