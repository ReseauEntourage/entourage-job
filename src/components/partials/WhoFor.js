import React from 'react';
import MultipleCTA from 'src/components/partials/MultipleCTA';
import SimpleSection from 'src/components/partials/SimpleSection';
import Img from 'src/components/utils/Img';

const WhoFor = () => {
  const content = [
    {
      text: (
        <div>
          <span className="uk-text-bold">
            Être prêt à l’emploi et dans une démarche active de recherche
          </span>{' '}
          (fin de parcours en structure d’insertion, freins sociaux levés ou
          accompagnés, avoir établi un projet…)
        </div>
      ),
    },
    {
      text: (
        <div>
          <span className="uk-text-bold">Être disponible </span>pour consacrer
          du temps à la recherche d’emploi et aux processus de recrutements.
          Pouvoir commencer à travailler immédiatement
        </div>
      ),
    },
    {
      text: (
        <div>
          <span className="uk-text-bold">
            Être éligible à un contrat de travail en France{' '}
          </span>
          (pièce d’identité / autorisation de travail, domiciliation, compte
          bancaire, attestation de Sécurité Sociale)
        </div>
      ),
    },
    {
      text: (
        <div>
          <span className="uk-text-bold">
            Avoir un niveau de français suffisant{' '}
          </span>
          permettant un entretien d’embauche
        </div>
      ),
    },
  ];

  return (
    <SimpleSection
      style="muted"
      container="large"
      fontSize="small"
      title={
        <>
          <span className="uk-text-primary">À qui</span> s&apos;adresse
          LinkedOut&nbsp;?
        </>
      }
      text={
        <>
          <div className="uk-container uk-container-small">
            LinkedOut s’adresse à des personnes{' '}
            <span className="uk-text-bold">prêtes et motivées</span> pour
            travailler mais qui, par{' '}
            <span className="uk-text-bold">manque de réseau professionnel</span>{' '}
            et en raison d’un{' '}
            <span className="uk-text-bold">parcours difficile</span>, peinent à
            trouver du travail par leurs propres moyens.
          </div>
          <Img
            src="/static/img/new_candidates.jpg"
            alt="Candidats LinkedOut"
            className="uk-padding-large uk-padding-remove-vertical uk-margin-medium-top"
          />
        </>
      }
      id="whoFor"
    >
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <h3 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          Quelques critères essentiels pour intégrer le dispositif&nbsp;:
        </h3>
        <MultipleCTA
          data={content}
          showVerticalDividers
          spacing="small"
          className="uk-margin-large-bottom uk-container-small"
          animate
        />
        <p className="uk-text-muted uk-text-center uk-container uk-container-small">
          Le dispositif LinkedOut fonctionne par promotions de 6 mois (30 à 60
          candidats). Les candidats qui rejoignent le dispositif doivent être
          prêts à vivre des rencontres collectives, à être rendus visibles sur
          les réseaux sociaux et à être accompagnés par un coach LinkedOut.
        </p>
      </div>
    </SimpleSection>
  );
};

WhoFor.propTypes = {};

WhoFor.defaultProps = {};

export default WhoFor;
