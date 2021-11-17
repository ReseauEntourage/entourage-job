import React from 'react';
import { Section } from 'src/components/utils';

export const linkedOutStyled = (color = 'white', fontSize = 16) => {
  return (
    <span
      style={{
        fontWeight: 700,
        color,
        fontSize: `${fontSize}px`,
        whiteSpace: 'nowrap',
      }}
    >
      Linked
      <span
        style={{
          background: 'rgb(245, 95, 36)',
          color: 'white',
          borderRadius: '2px',
          display: 'inline-block',
          lineHeight: `${fontSize + 1}px`,
          marginLeft: '2px',
          padding: '0 2px',
        }}
      >
        out
      </span>
    </span>
  );
};

export const linkedInStyled = (color = 'white', fontSize = 16) => {
  return (
    <a
      className="ent-logo-hover"
      href="https://www.linkedin.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span
        style={{
          fontWeight: 700,
          color,
          fontSize: `${fontSize}px`,
          whiteSpace: 'nowrap',
        }}
      >
        Linked
        <span
          style={{
            background: '#0077b5',
            borderRadius: '2px',
            color: 'white',

            display: 'inline-block',
            lineHeight: `${fontSize + 1}px`,
            marginLeft: '2px',
            padding: '0 2px',
          }}
        >
          in
        </span>
      </span>
    </a>
  );
};

const LinkedInPartial = () => {
  return (
    <Section container="small" style="muted">
      <h2 className="uk-text-center uk-text-bold">
        Quelle relation entre LinkedIn et LinkedOut&nbsp;?{' '}
        <span className="uk-text-primary">Éclaircissements</span>
      </h2>
      <div className="uk-margin-large-left uk-margin-large-right uk-margin-medium-top uk-text-justify">
        <p>
          LinkedOut est un dispositif lancé par l’association Entourage en
          juillet 2019. Ce projet a pour mission de redonner un réseau
          professionnel aux personnes exclues et en précarité, à travers la
          diffusion massive de leur CV sur les réseaux sociaux pour générer de
          la visibilité, et l’accompagnement par un coach bénévole jusqu’au
          retour à l’emploi.
        </p>
        <p>
          LinkedOut est une marque appartenant à LinkedIn, dont l’utilisation
          est autorisée de façon limitée par le biais d’une licence. Toutefois,
          le réseau solidaire LinkedOut n’est pas développé par LinkedIn, mais
          bien par l’association Entourage.
        </p>
        <p>
          LinkedIn soutient la mission et les valeurs véhiculées par ce
          dispositif, et a contribué au lancement de ce projet en ayant accordé
          une licence d’utilisation de sa marque LinkedOut à l’association
          Entourage.
        </p>
      </div>
    </Section>
  );
};

export default LinkedInPartial;
