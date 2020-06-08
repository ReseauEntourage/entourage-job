import React from 'react';
import {Section} from '../utils';
import MultipleCTA from "../partials/MultipleCTA";

const WaysToJoin = () => {
  const content = [
    {
      text: <div>En fin de parcours d’insertion, les candidats nous sont <span className="uk-text-bold">orientés par les chargées d’accompagnement</span> des structures d’insertion professionnelles</div>,
    },
    {
      text: <div>Les candidats sont <span className="uk-text-bold">orientés par les travailleurs sociaux d’associations partenaires</span> ou de dispositif publics</div>,
    },
    {
      text: <div>Les candidats sont orientés par <span className="uk-text-bold">des membres du réseau Entourage</span></div>,
    },
    {
      text: <div>Les candidats <span className="uk-text-bold">candidatent spontanément</span> depuis le site internet</div>,
    },
  ];

  return (
    <Section
      id="waysToJoin"
      style="muted"
      container="small">
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          Plusieurs <span className="uk-text-primary">manières de rejoindre</span> LinkedOut
        </h2>
        <MultipleCTA
          data={content}
          showVerticalDividers
          spacing='small'
          className="uk-margin-large-bottom"
        />
        <hr className="uk-divider-small uk-margin-remove-top uk-margin-large-bottom" />
        <MultipleCTA
          data={[
            {
              title: "Je cherche un candidat",
              text: <div>Je cherche un profil en particulier</div>,
              button: {
                label: "Je découvre les candidats",
                href: "/lescandidats"
              }
            },
            {
              title: "Mon offre d’emploi concerne plusieurs profils",
              text: <div>Vous avez régulièrement des besoins de recrutement&nbsp;? Vous avez plusieurs offres d’emploi à pourvoir&nbsp;?</div>,
              button: {
                label: "J’envoie mon offre à LinkedOut",
                href: process.env.AIRTABLE_LINK_BECOME_COACH,
                modal: "#modal-offer-add"
              }
            }
          ]}
          showHorizontalDividers
        />
      </div>
    </Section>
  );
};

WaysToJoin.propTypes = {

};

WaysToJoin.defaultProps = {
};

export default WaysToJoin;
