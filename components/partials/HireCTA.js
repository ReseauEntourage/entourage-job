import React from 'react';
import { Button, GridNoSSR, IconNoSSR, Section } from '../utils';

import './HireCTA.less';
import CVList from '../cv/CVList';
import GlobalOffer from './GlobalOffer';

const HireCTA = () => {
  return (
    <Section>
      <GridNoSSR column middle>
        <div className="uk-container-small uk-margin-medium-bottom">
          <h2 className="uk-text-center uk-text-bold">
            <span className="uk-text-primary">Déposez une offre</span> et
            recrutez&nbsp;!
          </h2>
          <p className="uk-margin-medium-top uk-text-center">
            Découvrez ci-dessous les profils et CV de la promo #3 et envoyez
            votre offre au candidat dont le profil correspond à vos besoins de
            recrutement.
            <br />
            <br />
            Les candidats LinkedOut de cette promo recherchent majoritairement
            dans les secteurs de 1ère qualification et sont situés en
            Île-de-France.
          </p>
        </div>
      </GridNoSSR>

      <CVList nb={3} hideEmployed />
      <GridNoSSR middle column gap="collapse">
        <Button
          href="/entreprises/cvs"
          style="secondary"
          className="uk-margin-medium-top"
        >
          Découvrez tous les CV et déposez une offre{' '}
          <IconNoSSR name="chevron-right" />
        </Button>
      </GridNoSSR>
      <GlobalOffer />
    </Section>
  );
};

export default HireCTA;
