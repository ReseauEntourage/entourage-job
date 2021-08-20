import React from 'react';
import MultipleCTA from 'src/components/partials/MultipleCTA';
import { Section } from 'src/components/utils';
import Img from 'src/components/utils/Img';

const HowToJoin = () => {
  const content = [
    {
      text: (
        <div>
          Être{' '}
          <span className="uk-text-bold">
            disponible pour vous investir dans votre recherche d’emploi
          </span>{' '}
          (1 rencontre par semaine avec le Coach, entraînements aux entretiens…)
        </div>
      ),
    },
    {
      text: (
        <div>
          Être{' '}
          <span className="uk-text-bold">prêt à travailler immédiatement</span>{' '}
          dès que des opportunités d’emplois se présentent à vous
        </div>
      ),
    },
    {
      text: (
        <div>
          Être{' '}
          <span className="uk-text-bold">
            éligible à un contrat de travail en France
          </span>{' '}
          (pièce d’identité / autorisation de travail, domiciliation, compte
          bancaire, attestation de Sécurité Sociale)
        </div>
      ),
    },
    {
      text: (
        <div>
          Avoir{' '}
          <span className="uk-text-bold">un niveau de français suffisant</span>{' '}
          permettant un entretien d’embauche
        </div>
      ),
    },
  ];

  return (
    <Section id="howToJoin" container="small" style="muted">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
        Que faut-il pour{' '}
        <span className="uk-text-primary">rejoindre LinkedOut&nbsp;?</span>
      </h2>
      <h4 className="uk-text-center uk-margin-medium-bottom uk-text-bold">
        Pour rejoindre le dispositif, vous devez remplir les conditions
        suivantes&nbsp;:
      </h4>
      <MultipleCTA
        data={content}
        showVerticalDividers
        spacing="small"
        className="uk-margin-large-bottom uk-container-small"
      />
      <div className="uk-flex uk-flex-center">
        <Img
          src="/static/img/cover-linkedout.jpg"
          alt="Binôme"
          className="uk-height-max-large"
        />
      </div>
    </Section>
  );
};

HowToJoin.propTypes = {};

HowToJoin.defaultProps = {};

export default HowToJoin;
